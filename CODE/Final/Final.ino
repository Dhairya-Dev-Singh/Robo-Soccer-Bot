// ESP32 Robo Soccer Bot Controller
// FlySky FS-i6 + FS-iA6B Receiver
// 2 x BTS7960 Motor Drivers
//
// CH1 = Steering
// CH2 = Throttle
// CH6 = SWC Gear Selector
//
// SWC gears:
// Position 1 = 40% speed
// Position 2 = 70% speed
// Position 3 = 100% speed

// ---------- Receiver pins ----------
const int CH1_PIN  = 34;   // Steering
const int CH2_PIN  = 35;   // Throttle
const int GEAR_PIN = 13;   // Receiver CH6 / SWC

// ---------- Left BTS7960 ----------
const int LEFT_RPWM = 25;
const int LEFT_LPWM = 26;
const int LEFT_EN   = 33;

// ---------- Right BTS7960 ----------
const int RIGHT_RPWM = 27;
const int RIGHT_LPWM = 14;
const int RIGHT_EN   = 32;

// ---------- Settings ----------
const int MAX_PWM = 255;       // Maximum PWM output
const int DEADZONE = 35;       // Neutral stick deadzone
const unsigned long SIGNAL_TIMEOUT = 30000;

// ---------- Setup ----------
void setup() {
  Serial.begin(115200);

  // Receiver inputs
  pinMode(CH1_PIN, INPUT);
  pinMode(CH2_PIN, INPUT);
  pinMode(GEAR_PIN, INPUT);

  // Left BTS7960
  pinMode(LEFT_RPWM, OUTPUT);
  pinMode(LEFT_LPWM, OUTPUT);
  pinMode(LEFT_EN, OUTPUT);

  // Right BTS7960
  pinMode(RIGHT_RPWM, OUTPUT);
  pinMode(RIGHT_LPWM, OUTPUT);
  pinMode(RIGHT_EN, OUTPUT);

  // Keep all motors stopped during startup
  stopAllMotors();

  Serial.println();
  Serial.println("Robo Soccer Controller Ready");
  Serial.println("CH1 = Steering");
  Serial.println("CH2 = Throttle");
  Serial.println("CH6 = SWC Gear Selector");
  Serial.println("Motors stopped during startup");
}

// ---------- Main loop ----------
void loop() {
  // Read receiver pulse widths
  unsigned long ch1 = pulseIn(
    CH1_PIN,
    HIGH,
    SIGNAL_TIMEOUT
  );

  unsigned long ch2 = pulseIn(
    CH2_PIN,
    HIGH,
    SIGNAL_TIMEOUT
  );

  unsigned long gearPulse = pulseIn(
    GEAR_PIN,
    HIGH,
    SIGNAL_TIMEOUT
  );

  // Validate receiver signals
  if (!validSignal(ch1) ||
      !validSignal(ch2) ||
      !validSignal(gearPulse)) {

    stopAllMotors();

    Serial.println("Invalid receiver signal - motors stopped");

    delay(50);
    return;
  }

  // Determine selected gear
  int gearPercent = getGearPercent(gearPulse);

  // Convert steering and throttle to -255 to +255
  int steering = map(
    ch1,
    1000,
    2000,
    -MAX_PWM,
    MAX_PWM
  );

  int throttle = map(
    ch2,
    1000,
    2000,
    -MAX_PWM,
    MAX_PWM
  );

  steering = constrain(
    steering,
    -MAX_PWM,
    MAX_PWM
  );

  throttle = constrain(
    throttle,
    -MAX_PWM,
    MAX_PWM
  );

  // Apply deadzone around the center
  if (abs(steering) < DEADZONE) {
    steering = 0;
  }

  if (abs(throttle) < DEADZONE) {
    throttle = 0;
  }

  // Reverse controls to match your robot
  throttle = -throttle;
  steering = -steering;

  // Apply selected gear percentage
  throttle = throttle * gearPercent / 100;
  steering = steering * gearPercent / 100;

  // Differential drive mixing
  int leftCommand = throttle + steering;
  int rightCommand = throttle - steering;

  // Keep output within safe PWM range
  leftCommand = constrain(
    leftCommand,
    -MAX_PWM,
    MAX_PWM
  );

  rightCommand = constrain(
    rightCommand,
    -MAX_PWM,
    MAX_PWM
  );

  // Drive left and right motor groups
  driveMotor(
    leftCommand,
    LEFT_RPWM,
    LEFT_LPWM,
    LEFT_EN
  );

  driveMotor(
    rightCommand,
    RIGHT_RPWM,
    RIGHT_LPWM,
    RIGHT_EN
  );

  // Serial monitor
  Serial.print("CH1 Steering: ");
  Serial.print(ch1);

  Serial.print(" | CH2 Throttle: ");
  Serial.print(ch2);

  Serial.print(" | CH6 SWC: ");
  Serial.print(gearPulse);

  Serial.print(" | Gear: ");
  Serial.print(gearPercent);
  Serial.print("%");

  Serial.print(" | Left PWM: ");
  Serial.print(leftCommand);

  Serial.print(" | Right PWM: ");
  Serial.println(rightCommand);

  delay(20);
}

// ---------- Check receiver signal ----------
bool validSignal(unsigned long signal) {
  return signal >= 900 && signal <= 2100;
}

// ---------- Select gear from SWC ----------
int getGearPercent(unsigned long gearPulse) {
  if (gearPulse < 1300) {
    // SWC position 1
    return 40;
  }

  else if (gearPulse < 1700) {
    // SWC position 2
    return 70;
  }

  else {
    // SWC position 3
    return 100;
  }
}

// ---------- BTS7960 motor control ----------
void driveMotor(
  int command,
  int rpwmPin,
  int lpwmPin,
  int enablePin
) {
  command = constrain(
    command,
    -MAX_PWM,
    MAX_PWM
  );

  if (command > 0) {
    // Forward
    digitalWrite(enablePin, HIGH);

    analogWrite(rpwmPin, command);
    analogWrite(lpwmPin, 0);
  }

  else if (command < 0) {
    // Reverse
    digitalWrite(enablePin, HIGH);

    analogWrite(rpwmPin, 0);
    analogWrite(lpwmPin, abs(command));
  }

  else {
    // Stop
    analogWrite(rpwmPin, 0);
    analogWrite(lpwmPin, 0);

    digitalWrite(enablePin, LOW);
  }
}

// ---------- Stop all motors ----------
void stopAllMotors() {
  analogWrite(LEFT_RPWM, 0);
  analogWrite(LEFT_LPWM, 0);

  analogWrite(RIGHT_RPWM, 0);
  analogWrite(RIGHT_LPWM, 0);

  digitalWrite(LEFT_EN, LOW);
  digitalWrite(RIGHT_EN, LOW);
}