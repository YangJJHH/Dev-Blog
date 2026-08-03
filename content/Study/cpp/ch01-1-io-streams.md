---
title: "[윤성우의 열혈 C++] Chapter 01-1 : printf와 scanf를 대신하는 입출력 방식"
date: 2025-02-09 23:08
tags:
  - "c++"
---
## \#include \<iostream>

c++에서는 입출력을 위한 printf,scanf 함수의 목적으로 사용한 \<stdio.h> 대신에 \<iostream>을 사용한다.

## std::cout과 << 연산자를 이용한 출력

> **출력 예제코드**

```cpp
#pragma once
#include <iostream>

int main(void)
{
	int num = 20;
	std::cout << "Hello Wolrd" << std::endl;
	std::cout << num << std::endl;
	return 0;
}
```

> **출력**

![[1-1.png]]

## std::cin과 >> 연사자를 이용한 입력

> **예제코드**

```cpp
#pragma once
#include <iostream>

int main(void)
{
	int val;
	std::cout << "숫자입력 :";
	std::cin >> val;

	std::cout << val << std::endl;
	return 0;
}
```

> **출력**

![[1-2.png]]
