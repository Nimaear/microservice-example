# Creating needed table

```sql
CREATE TABLE emails ( id UUID PRIMARY KEY DEFAULT gen_random_uuid(), data json );
```


Following tests are done with `ab`:

```bash
ab \
  -n 10000 \
  -c 100 \
  -T "application/json" \
  -v 4 \
  -p queue.json \
  http://localhost:3001/email
```

## Test with 10 services
```
Server Software:        
Server Hostname:        localhost
Server Port:            3001

Document Path:          /email
Document Length:        15 bytes

Concurrency Level:      100
Time taken for tests:   8.129 seconds
Complete requests:      10000
Failed requests:        0
Total transferred:      2210000 bytes
Total body sent:        1950000
HTML transferred:       150000 bytes
Requests per second:    1230.17 [#/sec] (mean)
Time per request:       81.289 [ms] (mean)
Time per request:       0.813 [ms] (mean, across all concurrent requests)
Transfer rate:          265.50 [Kbytes/sec] received
                        234.26 kb/s sent
                        499.76 kb/s total

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    1   1.0      1       7
Processing:     4   80  36.7     70     246
Waiting:        2   54  27.6     48     188
Total:          4   81  36.7     71     247

Percentage of the requests served within a certain time (ms)
  50%     71
  66%     84
  75%     93
  80%    100
  90%    139
  95%    160
  98%    178
  99%    186
 100%    247 (longest request)
```

## Test with 5 services
```
Server Software:        
Server Hostname:        localhost
Server Port:            3001

Document Path:          /email
Document Length:        15 bytes

Concurrency Level:      100
Time taken for tests:   5.065 seconds
Complete requests:      10000
Failed requests:        0
Total transferred:      2210000 bytes
Total body sent:        1950000
HTML transferred:       150000 bytes
Requests per second:    1974.36 [#/sec] (mean)
Time per request:       50.649 [ms] (mean)
Time per request:       0.506 [ms] (mean, across all concurrent requests)
Transfer rate:          426.11 [Kbytes/sec] received
                        375.98 kb/s sent
                        802.09 kb/s total

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    1   1.0      1       8
Processing:     8   49  15.3     48     249
Waiting:        2   35  12.4     34     221
Total:         10   50  15.2     49     250

Percentage of the requests served within a certain time (ms)
  50%     49
  66%     56
  75%     59
  80%     62
  90%     69
  95%     74
  98%     85
  99%    102
 100%    250 (longest request)
```
