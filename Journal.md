# Yugaantar 2026 Robo Soccer Bot

## My Build Journal

This is the complete journey of my Robo Soccer Bot, from the first idea to the moment it finally started working. I had a lot of ups and downs during this build, but every problem taught me something new.

**Total time logged: 28.5 hours across 13 entries**

[View the original project on Hack Club Forge](https://forge.hackclub.com/projects/4466)

![Robo Soccer Bot](https://cdn.hackclub.com/01a1d188-634f-70e6-a15d-40e051ec7640/WhatsApp-20Image-202026-11-13-20at-2001.10.33.jpeg)


## 1. Ideation

**Date:** November 5, 2026  
**Time spent:** 0:30

At first, I wanted to build a normal RC car with good speed and control. Then one of my friends suggested that I should build a soccer bot instead. That idea immediately made the project more interesting because I could build something that might also be useful for a future competition.

I started looking at different Robo Soccer Bot designs and made a rough idea of what I wanted my own robot to look like.

![Initial robot inspiration](https://cdn.hackclub.com/01a1ac3e-036f-77f5-aa33-276fa9adb25f/image.png)

![Early project idea](https://cdn.hackclub.com/01a1ac3e-3aa2-7cbc-9658-d8c38abd1da4/image.png)


## 2. Research

**Date:** November 6, 2026  
**Time spent:** 1:30

After deciding what I wanted to build, I started researching the parts. I compared different motors, motor drivers, batteries, wireless controllers, and microcontrollers.

After around thirty minutes of brainstorming, I decided to use an ESP32 as the main controller. I then selected the other components around it so that the electronics would be compatible with the robot.

![Research and component planning](https://cdn.hackclub.com/01a1afda-d6b8-7adc-bf3a-aa2a115708d4/image.png)


## 3. Dimensions and Layout

**Date:** November 6, 2026  
**Time spent:** 1:30

Once the main components were finalised, I measured everything and planned where each part would go on the robot. I wanted the motors, battery, ESP32, motor drivers, and buck converter to fit properly without making the robot too crowded.

I noted all the measurements down and started planning the chassis around the parts I already had.

![Component measurements](https://cdn.hackclub.com/01a1afe6-b394-71ba-9d83-33447e67663c/image.png)

![Initial layout planning](https://cdn.hackclub.com/01a1afe6-dbad-7496-94c9-e7ba512fd0c6/image.png)

![Layout reference](https://cdn.hackclub.com/01a1afe8-921b-7997-9f89-0093275a8c33/image.png)

![Parts placement planning](https://cdn.hackclub.com/01a1afe8-a57f-7646-bf62-37dc5c3bdaab/image.png)


## 4. Soldering and Basic Connections

**Date:** November 6, 2026  
**Time spent:** 3 hours

After collecting the components, I started soldering the motors, buck converter, and other wires. The buck converter was especially difficult because the soldering area was very small, but I managed to complete it.

At this stage, I was mainly focused on making the basic connections strong enough for testing. Some of the connections were still temporary, but this helped me understand how the complete power system would be arranged.

![Soldering the first connections](https://cdn.hackclub.com/01a1b026-5401-7f2d-87a2-863e27383104/image.png)

![Motor and power wiring](https://cdn.hackclub.com/01a1b026-6a60-73cd-a4c1-8a132bb88fca/image.png)

![Working on the buck converter](https://cdn.hackclub.com/01a1b02a-a9bb-7182-8b32-2e3df30374d1/image.png)


## 5. Connections

**Date:** November 6, 2026  
**Time spent:** 2 hours

Once the soldering was complete enough for a test, I started connecting all the components. I connected the motors to the BTS7960 motor drivers, connected the drivers to the ESP32, and prepared the receiver connections.

Before powering the logic circuit, I used a voltmeter to check the buck converter output. I wanted to make sure it was giving approximately 5 V for the ESP32 and the other components.

![Initial circuit connections](https://cdn.hackclub.com/01a1b02f-bd44-7d3c-83ed-ba7e18f16341/image.png)


## 6. Code and Calibration

**Date:** November 6, 2026  
**Time spent:** 4 hours

After making the connections, I started working on the code. One of the hardest parts was creating a control system that could read the FS-iA6B receiver and convert the receiver signals into motor movement.

I also started designing a website that could eventually act as a remote control for the robot. I wanted the interface to be interactive and more interesting than a basic control panel.

![Control interface design](https://cdn.hackclub.com/01a1b038-14f4-7991-99a2-f500966a2c73/Screenshot_2026-11-06_at_3.04.24_PM.png)

![Dashboard layout](https://cdn.hackclub.com/01a1b038-3299-7d16-a087-419b4f75ef6b/Screenshot_2026-11-06_at_3.04.12_PM.png)

![Control code](https://cdn.hackclub.com/01a1b038-8e5a-7ad5-b443-6efefdc7cf83/Screenshot_2026-11-06_at_3.03.34_PM.png)


## 7. CAD 1: Rough Sketching

**Date:** November 6, 2026  
**Time spent:** 1:30

After I had the measurements, I started making a rough sketch of the robot. I designed the base plate around 180 mm by 200 mm and added walls on three sides so that the electronics would have some protection from other robots.

The rough sketch was easier because I already knew the dimensions of the components and had a clear idea of where they needed to go.

![Rough chassis sketch](https://cdn.hackclub.com/01a1b054-2404-7a58-8d84-ef7a9e7805bf/image.png)

![Early chassis layout](https://cdn.hackclub.com/01a1b054-529c-79c9-b184-aa7d0f4bfc8a/image.png)


## 8. CAD 2: 3D Modelling

**Date:** November 6, 2026  
**Time spent:** 4.5 hours

I used the rough sketch as the base for the 3D model. I designed the chassis with walls to protect the connections and then worked on the claws. The claws were one of the toughest parts to design, but they were also one of the most interesting parts of the project.

One of my friends suggested adding a top plate so that another robot could not climb directly onto the electronics. I designed one, although I later decided not to use it because the circuit needed more ventilation.

The wheels were another challenge. The exact wheels needed for the motors were not easily available, so I decided to make custom wheels for the robot.

![3D chassis design](https://cdn.hackclub.com/01a1b05a-a571-7fda-adde-712ccd6f9540/Screenshot_2026-11-06_at_3.44.49_PM.png)

![Claw design](https://cdn.hackclub.com/01a1b05c-254d-702c-8b92-a2f0f0623e91/Screenshot_2026-11-06_at_11.28.35_AM.png)

![Second claw design](https://cdn.hackclub.com/01a1b05c-48a0-7ec1-95f6-c018bd5ee5be/Screenshot_2026-11-06_at_11.28.49_AM.png)

![Top plate design](https://cdn.hackclub.com/01a1b05e-10a4-7797-8393-3b50dc0f1b82/Screenshot_2026-11-06_at_3.48.23_PM.png)

![Custom wheel design](https://cdn.hackclub.com/01a1c0b8-eb26-7a16-bcda-a2d37a4d6dcd/image.png)

![Wheel modelling](https://cdn.hackclub.com/01a1c0b8-ec08-7f6e-a701-5bec24beb389/image.png)

![Complete CAD assembly](https://cdn.hackclub.com/01a1c0ba-e324-7436-b93a-870dd21e85ba/Screenshot_2026-11-09_at-7.27.49_PM.png)

![CAD assembly view](https://cdn.hackclub.com/01a1c0bb-5b62-73be-8d43-2bdedb5d6ec4/Screenshot_2026-11-09_at-7.27.40_PM.png)

![Final assembly check](https://cdn.hackclub.com/01a1c0bb-6a4c-75fa-aa48-18fdc5ab5bd3/Screenshot_2026-11-09_at-7.27.19_PM.png)


## 9. Circuit Design: Adding the FS-i6

**Date:** November 6, 2026  
**Time spent:** 1:15

After I finished the first version of the 3D model, one of my parcels arrived. It contained the FS-i6 transmitter, and I was really excited to add it to the project.

Since the receiver was a new part of the system, I had to design the circuit around it from scratch. This changed the project from a basic motor test into a proper wireless robot controller.

![FS-i6 circuit design](https://cdn.hackclub.com/01a1b097-269f-7d4b-8c42-212136f62124/Screenshot_2026-11-06_at_4.50.50_PM.png)


## 10. Re-code and Testing

**Date:** November 6, 2026  
**Time spent:** 3 hours

After designing the circuit, I started coding the receiver inputs and motor control from scratch. I had never worked with this exact receiver setup before, so it took a lot of studying and testing to understand the PWM values.

At first, the motors did not rotate. This was very frustrating because I had already spent a lot of time on the wiring and code. I checked the transmitter settings, changed the code, calibrated the channels, and tested the motor drivers again.

After a few fixes, the motors finally started working. I was extremely happy when it worked. I honestly started jumping because all the effort had finally turned into movement.

![First testing setup](https://cdn.hackclub.com/01a1b0af-f7fe-7371-a7e3-f782daa8a2c0/Screenshot_2026-11-06_at_5.17.59_PM.png)

![Motor testing result](https://cdn.hackclub.com/01a1b0b2-62d0-78ad-b3bf-bcffa91b3a40/Screenshot_2026-11-06_at_5.20.38_PM.png)

![Receiver testing](https://cdn.hackclub.com/01a1b0b2-a53d-729f-b494-5de6810d67c6/image.png)

![Calibration and wiring test](https://cdn.hackclub.com/01a1b0b2-ddce-7f5a-8755-2831c8387acf/image.png)


## 11. Solidifying the Circuit with Solder

**Date:** November 9, 2026  
**Time spent:** 1.7 hours

After the code was working, I started making the circuit more permanent. Some of the earlier connections had been made on a breadboard, and one of the motor wires had already broken. The wires were also not good enough for the final version, so I resoldered the motors and replaced the weak connections.

I connected the common positive and common negative lines and then used heat-shrink tubing to protect the solder joints.

![Resoldering the circuit](https://cdn.hackclub.com/01a1b147-46d1-7f10-ba57-64e80a0278b6/image.png)

![Common power connections](https://cdn.hackclub.com/01a1b147-85c1-7678-b5e7-c76c8d5c3083/image.png)


## 12. Assembly

**Date:** November 9, 2026  
**Time spent:** 2.5 hours

Once the soldering was done and all the components were ready, I started assembling the robot. I installed the motor brackets into the 3D-printed chassis and then secured all four motors.

After that, I placed the motor controllers and kept the ESP32 in the centre. I also installed the buck converter and connected the relevant wires. When everything was in place, I connected the battery connector and uploaded the code.

![Motor and chassis assembly](https://cdn.hackclub.com/01a1d148-2ba5-797d-8de9-6b80126fc5c9/image.png)


## 13. Failure and Victory

**Date:** November 9, 2026  
**Time spent:** 1.5 hours

After everything was in place, I connected the battery and turned on the robot. Unfortunately, the motor controller started overheating and one of the BTS7960 boards was damaged.

I replaced the damaged BTS7960 and tested the robot again. This time there were no more overheating issues, and the robot finally started working.

I also decided not to use the top plate in the final version. The enclosed circuit was heating up, and I did not want the electronics to get damaged again. It was a very fun project with a lot of ups and downs, but seeing the robot work made it worth it.

![Final robot after assembly](https://cdn.hackclub.com/01a1d149-18d6-75ce-8d84-154841c0a351/image.png)

![Final electronics and robot test](https://cdn.hackclub.com/01a1d149-32f2-75e5-bf04-0ded6c55a89a/image.png)


## What I learned

This project taught me much more than just how to make a robot move. I learned about power regulation, motor drivers, PWM signals, wireless receivers, ESP32 programming, soldering, CAD, 3D printing, and mechanical assembly.

The biggest lesson was debugging. When the motors did not move, the problem could have been the wiring, the receiver, the transmitter settings, the code, the motor drivers, or the power supply. I had to test each part instead of randomly changing everything.

The damaged BTS7960 also taught me that a working circuit still needs proper thermal management. A top cover might protect the circuit mechanically, but it can also trap heat. That is why I chose to leave the top plate out of the final version.

The robot is still an ongoing project. The next improvements will be adding a physical kill switch, improving cooling, monitoring current and temperature, and testing the robot on the actual competition surface.
