# CF_Parser
Parse test cases from codeforces and test them against your solutions. 
- The testing scripts work only for C++.
- The .cpp files must have the same name as the problem code of the respective contests. For example:
    - For the contest [1761](https://codeforces.com/contest/1761), the name of your .cpp files must be `A.cpp`, `B.cpp`, `C.cpp`, `D.cpp`, `E.cpp`, `F1.cpp`, `F2.cpp` and `G.cpp` **ONLY**
## Installation

```bash
git clone https://github.com/BeruboIV/CF_Parser
cd CF_Parser
Move all the bash script (.sh) files to /usr/local/bin
Remove the .sh extension from the files
```

## Usage
To download the sample test cases:
```bash
cf_sample_gen contest_id
```
To test 
```bash
runSamples problem_letter
```
Example: `runSamples C` will test your code against sample test cases for **Problem C**.