---
title: "[윤성우의 열혈 C++] Chapter 01-3 : 매개변수의 디폴트 값 (Default Value)"
date: 2025-02-10 00:36
category: "Language/C++"
tags:
  - "c++"
source: https://devwogur.tistory.com/3
---
## 매개변수에 설정하는 디폴트 값의 의미

다음의 형태로 선언하는 것이 가능하다.

```cpp
int MyFuncOne(int num =7)
{
	num++;
	return num;
}
int MyFuncTwo(int a = 1, int b = 2)
{
	return a + b;
}
```

## 디폴트 값은 함수의 선언 부분에만 표현하면 된다

함수의 원형을 별도로 선언하는 경우 매개변수 디폴트 값은 함수의 원형 선언에만 위치시켜야 한다

```cpp
int Adder(int num = 1, int num2 = 2);

int main(void)
{

	std::cout << Adder() << std::endl;
	return 0;
}

int Adder(int num, int num2)
{
	return num + num2;
}
```

> 디폴트 값의 선언이 함수의 선언부에 위치애햐 하는 이유

잘 생각해보면 선언부분에 위치 하지 않는다면 Adder() 와 같은 호출부분이 컴파일 되지 않음

## 부분적 디폴트 값 설정

```cpp
int Adder(int num = 1, int num2 = 2, int num3 = 3);
```

모두 디폴트값을 지정해 줄 수도 있고

```cpp
int Adder(int num, int num2, int num3 = 3);
```

다음과 같이 일부부만 지정할 수도 있다.

#### 주의해야할점은 오른쪽 매개변수의 디폴트 값부터 채우는 형태로 정의해야한다.

```cpp
// 마지막이 채워지지 않음
int Adder(int num = 1, int num2 = 2, int num3);
```

즉 위와 같이는 불가능

함수에 전달되는 인자가 왼쪽에서부터 오른쪽으로 채워지기 때문에.
