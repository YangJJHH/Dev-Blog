---
title: "[윤성우의 열혈 C++] Chapter 10-2 단항 연산자 오버로딩"
date: 2025-03-03 16:48
tags:
  - "c++"
  - "단항-연산자-오버로딩"
  - "전위증가와-후위증가-구분"
---
[2025.03.03 - [Language/C++] - [윤성우의 열혈 C++] Chapter 10-1 연산자 오버로딩의 이해와 유형](https://devwogur.tistory.com/21)

## 증가, 감소 연산자의 오버로딩

대표적인 단항연산자로는 다음 두가지가 있다.

- ++ 증가연산자
- -- 감소 연산자

그럼 앞서 보인 Point클래스에 ++연산자가 오버로딩 되어있다고 가정해보자

```cpp
++pos; //Point 객체
```

멤버함수로 오버로딩 되었다면, 이문장은 아래 문장으로 해석될 수 있다.

```cpp
pos.operator++();
```

그런데 전역함수로 오버로딩되어있다고 한다면, 다음과 같이 해석되어야 한다.

```cpp
operator++(pos);
```

그럼 ++는 멤버함수로 --는 전역함수로 오버로딩한 예제를 보자

```cpp
class Point
{
private:
	int xPos;
	int yPos;
public:
	Point(int x = 0, int y = 0) : xPos(x), yPos(y)
	{}

	Point& operator--()
	{
		this->xPos--;
		this->yPos--;
		return (*this);
	}

	friend Point& operator--(Point &p1);
};

Point& operator--(Point& p1)
{
	p1.xPos--;
	p1.yPos--;
	return p1;
}
```

다음과 같이 어렵지 않게 이해할 수 있다.

그런데 오버로딩한 함수들을 보면 모두 객체의 참조형을 반환하는것을 볼 수있다.

이렇게 하는 이유는 무엇일까??

```cpp
++(++pos);
```

참조형을 반환하게 되면 위와 같은 호출이 가능해진다.

위 코드는 아래와 같이 볼 수 있고

++(pos.operator++());

pos.operator++(); 호출결과는 참조값으로 다시 아래와 같이 볼 수 있다.

++(pos의 참조값);

따라서 참조형을 반환하면서 이런 연속적인 호출을 가능하게 한다.

## 전위증가 후위증가 구분

그렇다면 위치에 따른 ++,--연산자의 전위, 후위 구분은 어떻게 할까??

C++에서는 다음과 같이 규칙을 정의하고 있다

++pos => pos.operator++();

pos++ => pos.operator++(int);

즉, int 키워드를 통해 후위연산과 전위연산을 구분한다.

**물론 여기서 구분을 위해 int 키워드를 사용하는것이지 실제로 인자로 데이터를 전달하는것은 아니다**

예제를 보자

```cpp
class Point
{
private:
	int xPos;
	int yPos;
public:
	Point(int x = 0, int y = 0) : xPos(x), yPos(y)
	{}

	Point& operator++() // 전위 증가
	{
		xPos += 1;
		yPos += 1;
		return (*this);
	}

	const Point& operator++(int) // 후위 증가
	{
		const Point retObj(*this);
		xPos += 1;
		yPos += 1;
		return retObj;
	}
};
```

int 키워드를 통해 전위,후위 연산에 대한 구분을 하고 있다.

여기서 const Point& operator++가 왜 반환형이 const로 되었는지 알겠는가??

retObj가 const여서가 아니다. retObj가 const여도 어차피 반환할떄 새로운 임시 객체를 생성해 반환하기 때문에 이유가 되지 않는다.

이유는 반환하는 임시객체를 const객체(상수객체)로 만들기 위함이다.

즉 아래와 같은 코드를 컴파일 에러를 내기 위함인데

```cpp
(pos++)++; // 컴파일 에러!
```

(pos++)의 결과가 상수객체이면, 그 다음 ++을 실행할때 에러가 발생한다

왜냐하면 상수객체에 대해서는 const함수 호출만 가능하기 떄문이다.

왜 위와 같은 컴파일 에러를 내기위해 const로 반환할까??

c++에서 다음과 같은 연산을 허용하지 않는 특성을 그대로 반영하기 위해서다

```cpp
int num = 100;
(num++)++; // 컴파일 에러!
```
