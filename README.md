# Finders-Keepers-Backend Documentation
## Load Testing
####  All times are in miliseconds
 - Created 100 virtual users every second for 5 seconds
```
All virtual users finished
Summary report @ 12:49:09(-0700) 2018-06-21
  Scenarios launched:  500
  Scenarios completed: 500
  Requests completed:  500
  RPS sent: 90.74
  Request latency:
    min: 20.3
    max: 58.6
    median: 21.8
    p95: 24.8
    p99: 37
  Scenario counts:
    0: 500 (100%)
  Codes:
    409: 500
    
```
- Created 200 virtual users every second for 10 seconds.
```
All virtual users finished
Summary report @ 13:02:15(-0700) 2018-06-21
  Scenarios launched:  2000
  Scenarios completed: 2000
  Requests completed:  2000
  RPS sent: 189.75
  Request latency:
    min: 20.9
    max: 91.5
    median: 44.3
    p95: 71.1
    p99: 80.5
  Scenario counts:
    0: 2000 (100%)
  Codes:
    409: 2000
```
- Created 250 virtual users every second for 5 seconds
```
All virtual users finished
Summary report @ 13:05:32(-0700) 2018-06-21
  Scenarios launched:  3750
  Scenarios completed: 3750
  Requests completed:  3750
  RPS sent: 202.16
  Request latency:
    min: 30.3
    max: 3096.5
    median: 1403.2
    p95: 2926.1
    p99: 3055.8
  Scenario counts:
    0: 3750 (100%)
  Codes:
    409: 3750
```