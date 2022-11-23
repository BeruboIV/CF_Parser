# +--------------------+
# |                    |
# |   GENERAL CONFIG   |
# |                    |
# +--------------------+
SHELL=/bin/bash
PROBLEM_NAME := problem_name
DEBUG := true
# LANG := cpp

CLEAN_TARGETS := $(PROBLEM_NAME)

# +-------------------+
# |                   |
# |   GENERAL RULES   |
# |                   |
# +-------------------+




# +---------------------+
# |                     |
# |   C++ COMPILATION   |
# |                     |
# +---------------------+
$(PROBLEM_NAME): $(PROBLEM_NAME).cpp
	@echo "[DEBUG MODE] Compiling $${PROBLEM_NAME}.cpp with c++17."
	@time g++ -std=c++17 -DBeruboIV $(PROBLEM_NAME).cpp -o $(PROBLEM_NAME)