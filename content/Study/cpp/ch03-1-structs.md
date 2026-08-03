---
title: "[윤성우의 열혈 C++] Chapter 03-1 C++에서의 구조체"
date: 2025-02-13 00:00
tags:
  - "c++"
  - "stuct"
  - "구조체"
---
## C에서의 구조체 선언

```cpp
struct Car basicCar;
```

C언에서의 구조체 변수 선언은 위와 같다. struct키워드를 붙여 선언해야하는데 이를 생략하려면 typedef로 선언을 추가해야한다.

하지만 C++에서는 기본자료형 선언방식이나 구조체 선언방식이나 차이가 없다. 즉, 별도의 typedef없이도 다음과 같이 선언 할 수 있다.

```cpp
Car basicCar;
```

> 예시코드

```cpp
struct Car
{
	char szID[256];
    int speed;
    int fuel;
};

int main(void)
{
	Car basicCar = {"run",90,100}; 
	return 0;
}
```

C++ 에서는 다음과 같이 초기화가 가능하다.
