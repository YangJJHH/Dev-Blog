---
title: "[윤성우의 열혈 C++] Chapter 02-4 : 참조자와 함수"
date: 2025-02-12 00:21
tags:
  - "c++"
---
## Call-by-value & Call-by-reference

우선 C언어에서 함수 호출 방식에 두가지가 있다

- Call-by-value : 값을 인자로 전달하는 함수의 호출방식
- Call-by-reference : 주소값을 인자로 전달하는 호출 방식

> Call-by-value 예제코드

```cpp
void SwapByValue(int n1, int n2)
{
	int temp = n1;
	n1 = n2;
	n2 = temp;
}
```

> Call-by-reference 예제코드

```cpp
void SwapByRef(int* n1, int* n2)
{
	int temp = *n1;
	*n1 = *n2;
	*n2 = temp;
}
```

**Call-by-reference에서의 중요한 점은 주소값을 전달한다는 행위보다 함수내에서 외부 변수에 접근이 가능하다는점.**

C++에서 함수외부에 선언된 변수의 접근방법으로 두가지 존재하는데 하나는 위와 같이 "주소값"을 이용하는법, 다른 하나는 "참조자"를 이용하는 방식이다.

## 참조자를 이용한 Call-by-reference

```cpp
void SwapByRef2(int& ref1, int& ref2)
{
	int temp = ref1;
	ref1 = ref2;
	ref2 = temp;
}
```

참조자는 선언과 동시에 변수로 초기화가 진행되어야 한다 했는데 위를 보면 잘 이해가 안갈수도 있다.

하지만 **매개변수는 함수가 호출되어야 초기화가 진행되는 변수들이다.**

즉, 위의 매개변수 선언은 초기화가 이뤄지지 않은것이 아니라, 함수 호출 시 전달되는 인자로 초기화를 진행하겠다는 의미의 선언이다.

## 반환형이 참조형(Reference Type)인 경우

함수의 반환형에도 참조형이 선언될 수 있다. 아래를 보자

```cpp
int& RefRetFunceOne(int& ref)
{
	ref++;
	return ref;
}

int main(void)
{
	using namespace std;
	int num = 1;
	int& num2 = RefRetFunceOne(num);

	num++;
	num2++;

	cout << num << endl;
	cout << num2 << endl;
	return 0;
}
```

> 실행결과

![[7-1.png]]

위 상황은 함수에 매개변수를 참조자로 받아 반환값도 참조자 형태로 반환시키며, 반환값을 받는 부분도 참조자로 선언하고있다. num에 대한 참조자가 각각 ref,num2가 생긴셈이다 즉 3개 전부 같음.

그럼 위 상황에서 딱 한줄만 바꾸게 되는 상황을 보자

```cpp
#pragma once
#include <iostream>

int& RefRetFunceOne(int& ref)
{
	ref++;
	return ref;
}

int main(void)
{
	using namespace std;
	int num = 1;
	int num2 = RefRetFunceOne(num); // 참조자로 받지 않음

	num+=1;
	num2+=100;

	cout << num << endl;
	cout << num2 << endl;
	return 0;
}
```

RefRetFunceOne(num); 의 반환값을 받는 부분을 참조자로 받지 않고 일반 변수로 받게 바뀌었다.

> 실행결과

![[7-2.png]]

num2가 더이상 num에 대한 참조자가 아니고 일반 변수이므로 서로 다른값을 출력하는것을 볼 수 있다.

## 잘못된 참조의 반환

```cpp
int& RefRetFunceOne(int n)
{
	int num = 20;
	num += n;
	return num;
}
```

위와 같이 함수의 지역변수에 대한 참조를 반환하는 경우 문제가 발생한다.

num은 함수가 끝나면 소멸되는 변수인데 함수외부에서 이 참조반환 받아 사용하면 아직 소멸되지 않은 찌거기 형태의 데이터를 참조해 보여준다.

해당 상황의 컴파일러가 에러를 던지지 않기 때문에 주의해야한다.

## Const 참조자

보통 참조자 앞에 const를 붙여 함수내부에서 해당 변수에 대해 변경하지 않겠다 명시적으로 선언해주는 경우가 있다.

```cpp
void Test(const int &a)
{
	// ...
}
```

또는 이미 const화 된 변수의 참조자를 선언할때 사용한다.

```cpp
const int num = 20;
// int &ref = num;  이렇게는 불가능!
const int &ref = num;
```

이미 상수화된 변수에 const없이 참조자를 붙여 변경가능하게 하는것은 논리적으로 맞지 않는다. 따라서 C++에서 이를 허용하지 않고 const를 붙여 선언하게 되어있다.

## Const 참조자, 상수 참조?!

마지막으로 잘 이해가 안갈수도 있지만 const를 붙이면 상수도 참조가 가능하다?!

```cpp
const int &ref = 20;
```

여태껏 참조자는 선언과 동시에 변수를 참조해야 하고 변수에 대해서만 선언가능하다 했는데. 이해가 안가지만 아래를 보자.

```cpp
int num = 20 + 30;
```

여기서 20,30과 같은 표현되는 숫자를 리터럴 이라 한다.

> :"임시적으로 존재하는 값, 다음 행으로 넘어가면 존재하지 않는 상수"

20,30은 연산을 위해 모두 메모리 공간에 저장되어야 하지만 재참조가 가능한 값은 아니다.

그런데 c++에서는 위의 문장이 성립할 수 있도록 const참조자를 이용해서 상수를 참조할 때 '임시 변수'라는 것을 만든다. 그리고 이장소에 상수 30을 저장하고선 참조자가 이를 참조하게끔 한다.

> 왜 임시변수라는 잘 와닿지 않은 개념까지 활용해 상수 참조가 가능하게 했을까??

아래와 같은 함수에 전달을 목적으로 변수를 매번 선언하는것은 매우 번거로운일이 될 수 있는데 const참조자의 상수참조를 허용함으로써 간단히 호출 가능하다.

```cpp
int Adder(const int& a, const int& b)
{
	return a + b;
}

cout << Adder(1, 2) << endl; // 상수참조 가능으로 상수전달 가능
```

이러한 형태의 함수 호출이 가능하다는 정도로 알고 있자.
