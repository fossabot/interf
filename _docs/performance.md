# Performance

It was created [performance test](https://jsperf.com/interf) for interf 1.0.0. `instanceof` operator and `.isInterfaceOf()` method are compared.

Results for AMD Phenom 9750 Quad-Core Processor × 4, 4 GiB RAM, Ubuntu 16.04 LTS. 11 ops in every case.

| case | Chromium 59 | Firefox 54 | Opera 45 |
| :--- | :--- | :--- | :--- |
| mix | 520 980 x 11 ops/sec | 105 142 x 11 ops/sec | 421 950 x 11 ops/sec |
| instanceof | 521 832 x 11 ops/sec | 156 773 x 11 ops/sec | 510 428 x 11 ops/sec |
| isInterfaceOf | 601 694 x 11 ops/sec | 101 400 x 11 ops/sec | 443 682 x 11 ops/sec |
