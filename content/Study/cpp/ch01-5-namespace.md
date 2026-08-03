---
title: "[윤성우의 열혈 C++] Chapter 01-5 : namepace"
date: 2025-02-10 01:24
category: "Language/C++"
tags:
  - "c++"
source: https://devwogur.tistory.com/5
---
## 문제상황

다음과 같은 상황에서 함수의 이름이 동일하기 때문에 문제가 발상한다.

```cpp
void SimpleFunc(void)
{
	std::cout << "내가 정의한 함수";
}
void SimpleFunc(void)
{
	std::cout << "다른 사람이 정의한 함수";
}

int main(void)
{
	SimpleFunc();
	return 0;
}
```

함수뿐 아니라 변수명도 같은경우 문제가 발생하는데 이러한 상황을 해결하고 나온것이 namespace이다.

## 예시

아래는 위의 문제상황을 namespace를 통해 해결하는 예시이다

```cpp
namespace My
{
	void SimpleFunc(void)
	{
		std::cout << "내가 정의한 함수";
	}
}
namespace Other
{
	void SimpleFunc(void)
	{
		std::cout << "다른 사람이 정의한 함수";
	}
}
int main(void)
{
	My::SimpleFunc(); // 범위 지정
	return 0;
}
```

- namespace 키워드를 통해 이름공간을 분리하여 각 함수들을 따로 정의하였다.
- 호출할떄는 범위 지정 연산자 :: 를 통해 호출한다.

## namespace 중첩

```cpp
namespace My
{
	namespace Private
	{
		void SimpleFunc(void)
		{
			std::cout << "내가 정의한 함수";
		}
	}
}
```

일반적인 상황은 아니지만 namespace는 다음과 같이 중첩하여 사용할 수 도 있다.

이럴경우 범위지정자를 통해

```cpp
My::Private::SimpleFunc(); // 범위 지정
```

이렇게 사용할 수도 있고, 중첩이 되어 너무 길다 싶으면

## namespace 별칭

```cpp
	namespace MyFunc = My::Private; // My::Private 에 별칭 지정
	MyFunc::SimpleFunc(); // 범위 지정
```

위와 같이 My::Private 범위에 별칭을 주어 간단하게 MyFunc:: 으로 사용할 수 있는 방법도 있다.
