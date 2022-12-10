#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;032m'
NC='\033[0m'

# Checking if we have proper arguments list or not
if [ $# -ne 1 ]; then
    echo "$(basename $0): improper arguments list"
    echo "Usage: runSamples problem_name(ex. A,B...)"
    exit -1
fi

FILE_NAME=$1
# Compile the file
if [ -f ${FILE_NAME}.cpp ]
then
	if [ -f Makefile ]
	then
		make --silent PROBLEM_NAME=$1 || exit -1
	else
		echo "[DEBUG MODE] Compiling ${FILE_NAME}.cpp with c++17."
		time g++ -std=c++17 -DBeruboIV ${FILE_NAME}.cpp -o ${FILE_NAME}
	fi
else
	echo "File \"$1.cpp\" does not exist"
	exit -1
fi

function print_exit_code() {
    echo "The program finished with exit code $?"
}

INPUTS=($(ls  ${FILE_NAME}-*.in))
OUTPUTS=($(ls ${FILE_NAME}-*.out))

PASSED=0

function print_input() {
	echo -e "--------------------\nInput:"
	cat ${INPUTS[$1]}
	echo -e "\n--------------------"
}

function print_current_output() {
	echo -e "--------------------\nOutput:"
	cat OUTPUT.res
	echo
}

function print_expected_output() {
	echo -e "--------------------\nExpected:"
	cat ${OUTPUTS[$1]}
	echo -e "\n--------------------"
}

# Running against samples
TOTAL_TESTS=${#INPUTS[@]}
echo $TOTAL_TESTS
for (( i=1; i<=$TOTAL_TESTS; i++ ))
do
	echo "Running ${INPUTS[i - 1]}:"
	print_input $(( $i-1 ))

	/usr/bin/time -f "Time: %E" ./${FILE_NAME} < "${INPUTS[i - 1]}" > "OUTPUT.res" 

	print_current_output
	print_expected_output $(( $i-1 ))

	if diff -w OUTPUT.res ${OUTPUTS[i - 1]} > /dev/null 2>&1
	then
		PASSED=$(( $PASSED + 1 ))
		echo -e "${GREEN}Passed!${NC}\n"
	else
		echo -e "${RED}Failed${NC}\n"
	fi
	
	# print_exit_code
	rm -f "OUTPUT.res"
done

if [[ $PASSED == ${TOTAL_TESTS} ]]
then
	echo -e "${GREEN}${PASSED} / ${TOTAL_TESTS} passed${NC}"
else
	echo -e "${RED}${PASSED} / ${TOTAL_TESTS} passed${NC}"
fi

