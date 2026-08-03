---
title: "[윤성우의 열혈 C++] Chapter 02-5 new & delete"
date: 2025-02-12 23:24
category: "Language/C++"
tags:
  - "c++"
  - "delete"
  - "New"
source: https://devwogur.tistory.com/8
---
c에서 메모리 동적 할당/해제를 위해 사용되던 malloc , free를 대신하여 c++에서는 new, delete를 사용한다.

## new 사용법

```cpp
int a* = new int;		// int형 변수의 할당
int arr* = new int[3] 	// int형 배열 할당
```

## delete 사용법

```cpp
delete a; 	// 앞서 할당한 int형 변수의 소멸
delete []arr; // 앞서 할당한 int형 배열의 소멸
```

이제 C++에서는 new, delete를 사용하자 특히 객체를 할당할때 new가 아닌 malloc으로 할당하면 생성자가 호출이 안되는 현상을 볼 수있다.

> 즉 new와 malloc 함수의 동작방식에는 차이가 있다.

이후 클래스와 객체에서 정확히 이해 할수있다.
