#!/bin/bash

# Checking if we have proper arguments list or not
if [ $# -ne 1 ]; then
    echo "$(basename $0): improper arguments list"
    echo "Usage: dbrun problem_name(ex. A,B...)"
    exit -1
fi

FILE_NAME=$1
if [ -f ${FILE_NAME}.cpp ]
then
	if [ -f Makefile ]
	then
		make --silent PROBLEM_NAME=$1 && \
		./${FILE_NAME}
	else
		echo "[DEBUG MODE] Compiling ${FILE_NAME}.cpp with c++17."
		time g++ -std=c++17 -DBeruboIV $(FILE_NAME).cpp -o $(FILE_NAME) && \
		./${FILE_NAME}
	fi
else
	echo "File \"$1.cpp\" does not exist"
fi