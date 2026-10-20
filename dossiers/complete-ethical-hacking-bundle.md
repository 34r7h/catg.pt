# Complete Ethical Hacking Bundle — distillation

Source: 100 lessons (`content/lessons/`), sections 0. Course. Lesson 1: "Introduction", Lesson 21: "Introduction to the Course" (Web Hacking), Lesson 42: "Introduction" (Wi-Fi Hacking for Beginners), Lesson 57: "Course Introduction" (Practical Evil Twin Attacks with Captive Portals), Lesson 78: "Course Introduction" (Social Engineering). Lessons skipped for service/intro noise include intro lessons 1, 21, 42, 57, 78 and terminal wrap-up (e.g. 99, 100 - protective guidance but included in context; they are part of the final section on defense). The bundle is a 5-courses-in-1 introduction to ethical hacking/penetration testing foundations, presented as educational material only.

**Educational intent:** This course is for ethical hacking education in authorized/test lab environments only. All offensive techniques described are *course claims* of techniques taught, framed as tools to understand vulnerabilities in order to defend against them. Do not use any described commands/tools against real targets without explicit, written authorization.

## Section 1. Linux Fundamentals (lessons 2-20)
Covers core Linux skills needed for lab work.

- **Linux overview (lesson 2):** Linux is an OS (like Windows/Mac) that runs on much of the internet; advantages: free, stable, secure, customizable, runs well on older hardware. *Course claim*: strong Linux foundation is necessary for many hacking tools.
- **Installation (lesson 3):** Setting up Fedora in VirtualBox as a lab environment. Emphasizes safe, isolated practice.
- **Basic commands (lessons 4-5):** Navigation (`cd`, `pwd`, `ls`), file operations (`touch`, `cp`, `mv`, `rm`), viewing (`cat`, `more`, `less`, `head`, `tail`), directory management. *Educational*: practice in a sandbox only.
- **Users (lesson 6):** Adding new users (`adduser`, `passwd`). *Educational*: demonstrates privilege boundaries.
- **Package management (lesson 7):** `dnf` (Fedora) to install/update/remove packages. *Educational*: managing toolsets.
- **Networking commands (lesson 8):** `ip`, `ifconfig` (context), `ping`, `netstat`/related, hostname/DNS. Understanding network state for troubleshooting.
- **Networking tools (lesson 9):** Tools introduced for network inspection in lab context. *Course claim*: reconnaissance utilities.
- **Permissions (lesson 10):** File permissions (`chmod`), ownership (`chown`, `chgrp`). Access control concepts.
- **Encryption (lesson 11):** `gpg` to encrypt/decrypt files. Data protection.
- **Intermediate commands (lesson 12):** Pipes, redirection, `grep`, `find`, etc. Automation/scripting fundamentals.
- **Compression/extraction (lesson 13):** `tar`, `gzip`, `zip`, etc. for archives.
- **Partitioning (lesson 14):** `gparted`. Disk management concepts.
- **Shell scripting basics (lesson 15):** Writing simple scripts for automation tasks. Scripting literacy.
- **Services (lesson 16):** `systemctl` to manage services (start/stop/enable/disable).
- **Automation (lesson 17):** `crontab` for scheduled tasks. *Educational*: scheduling legitimate tasks.
- **Web server (lesson 18):** Setting up personal web server (Apache context) in lab. *Educational*: understand how web apps run.
- **WordPress on server (lesson 19):** Installing WordPress on a local web server for testing.
- **FTP server (lesson 20):** Setting up `vsftpd` in lab. *Educational*: understand file transfer services and misconfig risks.

## Section 2. Web Application Hacking (lessons 21-41)
Focuses on common web vulnerabilities in controlled test labs.

- **Web basics (lessons 22-24):** How the web works (HTTP), packet capture with Wireshark (`http.request`, headers), preparing a web testing lab (DVWA/target VMs or local test apps). Emphasizes authorized testing only.
- **Vulnerability scanning (lesson 25):** Using Vega web vulnerability scanner on lab targets. *Course claim*: automated scanning for education.
- **SQL fundamentals (lesson 26):** SQL introduction/examples in test context.
- **SQL injection (lesson 27):** Understanding SQLi in vulnerable lab apps. Bypass logic, UNION/context queries. *Course claim*: illustrate input validation failures. Must be in isolated lab.
- **SQLMap (lesson 28):** Automated SQL injection tool in authorized labs. *Course claim*: detection/exploitation mechanics for learning.
- **SQLi prevention (lesson 29):** Parameterized queries, input validation, least privilege, WAF awareness. Defense-focused.
- **WordPress scanning (lessons 30-32):** WPScan to enumerate vulnerabilities in lab WordPress installs; securing WordPress (updates, hardening). *Educational*: defender perspective emphasized.
- **Cross-Site Scripting (XSS) (lessons 33-35):** Stored/reflected XSS concepts; *course claim* examples in lab; prevention (input sanitization/output encoding, CSP). Ethical framing.
- **BeEF (lessons 36-38):** Browser Exploitation Framework in lab for understanding browser attacks; defeating/mitigating (script blocking, extensions, headers). Defense included.
- **Backdoors (lesson 39):** Weevely PHP backdoor — *course claim* as demonstration of post-exploitation in lab only; detection/prevention emphasized. Not for real targets.
- **CSRF (lesson 40):** Cross-Site Request Forgery concepts and *course claim* demo in lab; anti-CSRF tokens, SameSite, referer checks.
- **Phishing (lesson 41):** *Course claim* social engineering demo concept; defense via awareness. Included as context within web/social angles.

## Section 3. Wi-Fi Hacking Foundations (lessons 42-56)
Wireless concepts and attacks in controlled lab (with caution on legality).

- **Wireless basics (lesson 43):** Standards (a/b/g/n/ac), signals, frequencies (2.4GHz/5GHz), channels, SSIDs. *Educational*: network fundamentals.
- **Kali in VM (lesson 44):** Installing Kali Linux in VMware for lab use.
- **Monitor mode/packet injection (lesson 45):** Wireless adapter requirements, enabling monitor mode, injection. *Course claim*: prerequisites for lab testing on test APs.
- **Hidden networks (lesson 46):** Detecting hidden SSIDs in lab. *Course claim*: beacon analysis.
- **MAC spoofing (lesson 47):** Changing MAC address. *Course claim*: evasion concepts taught defensively.
- **Wireshark wireless (lesson 48):** Wireless traffic inspection (filters, probes, beacons) in lab.
- **DoS (lesson 49):** Deauthentication attacks in lab context on isolated test networks. *Course claim*: impacts; prevention.
- **WEP cracking (lesson 50):** *Course claim*: WEP weaknesses demonstrated on obsolete/test APs to show why deprecated.
- **WPA/WPA2 cracking (lesson 51):** Handshake capture, dictionary attacks with lab wordlists. *Course claim*: password strength importance.
- **Wordlists (lesson 52):** `crunch` to generate custom wordlists for lab testing. Defense: strong passwords.
- **Speeding up WPA2 (lesson 53):** Optimization concepts in lab (e.g. precomputation awareness). *Educational*.
- **Pyrit (lesson 54):** WPA/WPA2 cracking tool usage in lab. *Course claim*: tool mechanics.
- **Reaver/WPS (lesson 55):** WPS PIN attacks on test APs. *Course claim*: deprecated features risk.
- **Evil Twin intro (lesson 56):** Introduction to rogue APs in lab context. Leads to next section.

## Section 4. Practical Evil Twin Attacks with Captive Portals (lessons 57-77)
Advanced wireless social engineering in isolated lab environment.

- **Sniff/inject setup (lesson 60):** Preparing for evil twin in lab (adapter selection, monitor/inject). Legal/ethical constraints emphasized as *course claim* context.
- **Fake AP setup (lessons 61, 65, 68):** Setting up rogue access points in test lab; with internet access considerations in lab only.
- **Captive portals (lessons 62, 64, 65, 71):** Creating/using captive portal pages in lab to capture credentials. *Course claim*: phishing via rogue AP. Strong defense framing.
- **Credential harvesting (lessons 63, 66, 67, 72, 73):** Sniffing login info, using SET (Social Engineering Toolkit), BeEF with captive portal, WPA Enterprise variants, targeting social media in lab demos. *Course claim*: attack chains for defense understanding.
- **Automation (lesson 70):** Airgeddon - automated evil twin attacks in lab context. *Course claim*: automation awareness.
- **DNS spoofing + BeEF (lesson 74):** Using WiFi Pumpkin for DNS spoofing/BeEF in lab. *Course claim*: redirection mechanics.
- **Detection (lessons 75, 76):** Detecting WiFi attacks with Wireshark (deauth, rogue beacons, probes); EvilAP Defender. Defensive focus.
- **Protection (lesson 77):** Guest WiFi, network segmentation, monitoring. Best practices.

## Section 5. Social Engineering & Post-Exploitation + Defense (lessons 78-100)
End-to-end social engineering, payloads, MITM, remote access, and strong defensive guidance.

- **SE foundations (lesson 79):** Social Engineering defined — psychological manipulation tactics. *Course claim*: attacker mindset for defense.
- **Malicious payloads (lessons 80-83):** MSFvenom, FatRat (undetectable payload concepts), shellter (injecting into exe), malicious Word doc in lab VMs only. *Course claim*: delivery vectors. Detection emphasized.
- **Meterpreter (lessons 84-85):** Meterpreter basics, extracting saved passwords with LaZagne in lab (target VM). *Course claim*: post-exploitation for learning containment.
- **VNC/capture (lesson 86):** Capturing VNC session in lab. *Course claim*: remote control risks.
- **Credential access (lesson 87):** Viewing saved WiFi passwords in lab. *Course claim*: demonstrates necessity of credential hygiene.
- **MITM (lessons 88, 92):** Man-in-the-middle attacks, combining MITMf + BeEF in lab. *Course claim*: ARP spoofing/DNS spoofing mechanics.
- **Phishing tools (lessons 89-90):** SET fake login page, Blackeye phishing tool in lab. *Course claim*: cloning/login harvesting; defense via awareness.
- **Browser exploitation & control (lessons 91, 93):** BeEF browser exploits, gaining control in lab. Mitigations.
- **Remote access without port forwarding (lesson 94):** *Course claim*: tunneling concepts in lab (ngrok/related) to understand exposure.
- **External network attacks (lessons 95-97):** Using SET outside local network (lab tunnel), BeEF outside local net (lab), phishing email attack demo in controlled lab. *Course claim*: attack surface expansion.
- **Detection & protection (lessons 98-100):** Detecting Meterpreter, protecting from browser exploits (script blocking, extensions), avoiding phishing attacks (URL inspection, VirusTotal, domain checks). Strong defensive focus throughout.

## Key tools named (course claims, for educational reference only)
Linux: `bash`, `cd/pwd/ls`, `cp/mv/rm`, `cat/less/head/tail`, `chmod/chown`, `gpg`, `grep/find`, `tar/gzip`, `gparted`, `systemctl`, `crontab`.  
Networking/recon: `ip/ifconfig`, `ping`, Wireshark, Vega scanner, WPScan, Aircrack-ng family context, `crunch`, `pyrit`, `reaver`, Airgeddon, WiFi Pumpkin, EvilAP Defender.  
Offensive (lab-only): SQLMap, BeEF, Metasploit Framework (`msfvenom`, Meterpreter), `shellter`, SET, Blackeye, Weevely, LaZagne, MITMf/ngrok context.  
Protective: script blockers, extensions, URL inspection (VirusTotal), strong passwords, updates, anti-CSRF, input validation, CSP, guest WiFi, network monitoring.

## Course stance
The material explicitly states techniques are for educational purposes only and must be used to expand knowledge, not for malicious/damaging attacks. Offensive demonstrations exist to teach defense. *Course claims* (accuracy/efficacy numbers not prominent; focus on techniques) should be attributed as course claims. Human-in-the-loop, authorization required, lab-only.
