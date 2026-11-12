# Robo-Soccer-Bot


## Controller

Controller is our first working control system for the Robo Soccer Bot that we built.

The project started as a simple motor-and-controller test. It has now grown into a four-wheel drive robot with wireless control, two BTS7960 motor drivers, an ESP32 control board, a three-gear system, and a browser dashboard for our devlog.

The main goal is not only to make the robot move, but to build the system carefully enough that we understand every connection, every control signal, and every safety step along the way.


## Project photos

Add photos here as the robot develops.

### The complete robot

<img width="1600" height="1204" alt="image" src="https://github.com/user-attachments/assets/08830e36-cd87-4b11-8431-245c9a64cfd6" />



### Controller and electronics

<img width="1600" height="1204" alt="image" src="https://github.com/user-attachments/assets/76392125-74e2-459d-a820-2028ae6afd58" />



### Wiring and drivetrain

<img width="2746" height="996" alt="image" src="https://github.com/user-attachments/assets/831e88a1-23b5-4208-a55f-ddb1e29a492b" />



### Devlog dashboard

<img width="1463" height="875" alt="Screenshot 2026-11-06 at 3 04 12 PM" src="https://github.com/user-attachments/assets/125b2dfd-8baf-43e2-acbf-0ecd4a98f383" />
<img width="701" height="503" alt="Screenshot 2026-11-06 at 3 04 24 PM" src="https://github.com/user-attachments/assets/8da230a4-9352-46e7-ac50-5daefd280ee3" />


## What the robot is designed to do

The robot uses a skid-steer drive system. The two motors on the left side work together, and the two motors on the right side work together.

This gives us simple differential steering:

- Both sides forward: the robot moves forward
- Both sides backward: the robot reverses
- Left side and right side at different speeds: the robot turns
- One side forward and the other side backward: the robot rotates in place

The current drivetrain is controlled wirelessly using a FlySky FS-i6 transmitter and its FS-iA6B receiver.


## Hardware

| Part | Component used |
|---|---|
| Microcontroller | ESP32 DevKit |
| Transmitter | FlySky FS-i6 |
| Receiver | FlySky FS-iA6B |
| Motor drivers | 2 × BTS7960 |
| Motors | 4 × Pro Gear Johnson Motor Grade A L67155CE26 |
| Battery | 3S Li-Po, 11.1 V, 2200 mAh, 30C |
| Voltage regulator | LM2596 buck converter adjusted to 5.0 V |
| Drive arrangement | 4WD skid-steer |


## How the control system works

The FS-i6 transmitter sends commands wirelessly to the FS-iA6B receiver. The receiver sends PWM signals to the ESP32, and the ESP32 converts those signals into motor commands.

```text
FS-i6 transmitter
        │
        │ wireless connection
        ▼
FS-iA6B receiver
        │
        ├── CH1: steering
        ├── CH2: throttle
        └── CH6: SWC gear selector
        │
        ▼
ESP32 Controller One
        │
        ├── Left BTS7960
        └── Right BTS7960
        │
        ▼
Four DC motors
```

The FS-i6 itself is not physically connected to the robot. Only the FS-iA6B receiver is wired to the ESP32 and the 5 V power rail.


## ESP32 pin map

### Receiver connections

| FS-iA6B receiver | ESP32 | Function |
|---|---:|---|
| CH1 signal | GPIO34 | Steering |
| CH2 signal | GPIO35 | Throttle |
| CH6 signal | GPIO13 | SWC gear selector |
| VCC | 5 V | Receiver power |
| GND | GND | Common ground |

The normal receiver signal range is:

```text
1000 µs  = minimum
1500 µs  = neutral
2000 µs  = maximum
```

### Left BTS7960

| BTS7960 pin | ESP32 pin |
|---|---:|
| RPWM | GPIO25 |
| LPWM | GPIO26 |
| R_EN | GPIO33 |
| L_EN | GPIO33 |
| VCC | 5 V |
| GND | GND |

### Right BTS7960

| BTS7960 pin | ESP32 pin |
|---|---:|
| RPWM | GPIO27 |
| LPWM | GPIO14 |
| R_EN | GPIO32 |
| L_EN | GPIO32 |
| VCC | 5 V |
| GND | GND |

The `R_IS` and `L_IS` current-sense pins are not being used at the moment.


## Three-gear system

The SWC three-position switch on the FS-i6 is used as a speed selector.

| SWC position | Gear | Maximum output |
|---|---:|---:|
| Position 1 | Gear 1 | 40% |
| Position 2 | Gear 2 | 70% |
| Position 3 | Gear 3 | 100% |

The receiver CH6 signal is connected to ESP32 GPIO13. The ESP32 reads the CH6 pulse width and applies the selected speed limit to both motor groups.


## Motor connections

### Left side

The two left motors are connected in parallel to the left BTS7960:

```text
Left motor red wires   → Left BTS7960 M+
Left motor black wires → Left BTS7960 M-
```

### Right side

The two right motors are connected in parallel to the right BTS7960:

```text
Right motor red wires   → Right BTS7960 M+
Right motor black wires → Right BTS7960 M-
```

If one motor spins opposite to the other motor on the same side, its two motor wires need to be swapped.


## Power arrangement

The battery powers the motors directly, while the LM2596 provides regulated 5 V power for the logic electronics.

```text
3S Li-Po positive  → both BTS7960 B+
3S Li-Po negative  → both BTS7960 B-

3S Li-Po positive  → LM2596 IN+
3S Li-Po negative  → LM2596 IN-

LM2596 OUT+ 5 V    → ESP32 VIN
LM2596 OUT+ 5 V    → FS-iA6B VCC
LM2596 OUT+ 5 V    → both BTS7960 VCC pins

LM2596 OUT-        → ESP32 GND
LM2596 OUT-        → FS-iA6B GND
LM2596 OUT-        → both BTS7960 GND pins
```

All grounds must be connected together.

The 3S Li-Po must not be connected directly to the ESP32 or receiver. Before connecting the logic electronics, adjust the LM2596 and measure its output with a multimeter. The output should be approximately **5.0 V**.


## Control mixing

Controller One uses differential-drive mixing:

```text
left output  = throttle + steering
right output = throttle - steering
```

The current software also includes:

- Full 100% output in Gear 3
- Reduced output in Gear 1 and Gear 2
- A neutral dead zone around the center of the sticks
- Reversed throttle and steering directions to match the current robot wiring
- Motor shutdown when the receiver signal is invalid
- Motor shutdown when the sticks are released
- FS-i6 failsafe configured to return the control channels to neutral

First-test checklist

Before connecting the battery:

- Check every positive and negative wire
- Confirm the LM2596 output is 5.0 V
- Confirm ESP32, receiver, and BTS7960 grounds are common
- Keep the robot's wheels lifted
- Confirm the FS-i6 is bound to the FS-iA6B receiver
- Confirm CH1 and CH2 are close to 1500 µs at neutral
- Move SWC and verify that CH6 changes between three values
- Confirm both motor groups stop when the sticks are released
- Test the transmitter failsafe with the wheels lifted
- Keep the Li-Po connector accessible


## Safety note

This version does not include a physical kill switch yet. The dashboard emergency-stop button is software-only and cannot replace a physical power disconnect.

A physical kill switch, suitable fuse protection, a Li-Po-safe enclosure, and proper battery charging/storage procedures should be added before competition or high-speed testing.


## Repository layout

```text
.
├── README.md
├── outputs/
│   ├── yugaantar-dashboard/
│   │   ├── index.html
│   │   ├── styles.css
│   │   ├── app.js
│   │   └── README.md
│   ├── esp32_connections_3s_lipo.xlsx
│   ├── robo_soccer_bot_connections_updated_3s.xlsx
│   └── simple_wiring_guide_3s_no_kill_switch.xlsx
└── work/
    └── spreadsheet generation scripts
```


## Why this project exists

This repository is also a record of the build process. The wiring, code, mistakes, fixes, and design decisions are being documented as we turn individual parts into a working robot.

The final result should be a robot that is fun to drive, safe to test, and easy for someone else to understand and reproduce.


## Working demo video link :
link : https://youtube.com/shorts/lHsHTyMbImI
