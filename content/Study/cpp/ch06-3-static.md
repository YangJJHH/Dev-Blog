---
title: "[윤성우의 열혈 C++] Chapter 06-3 C++에서의 static"
date: 2025-02-27 00:40
category: "Language/C++"
tags:
  - "c++"
  - "mutable"
  - "Static"
source: https://devwogur.tistory.com/17
---
## C언에서의 static

- 전연변수에 선언된 static의 의미
  - 선언된 파일 내에세만 참조를 허용하겠다는 의미
- 함수내에서 선언된 static의 의미
  - 한번만 초기화가 진행되고, 지역변수와 달리 함수를 빠져나가도 소멸되지 않는다

다음은 C++에서의 static 사용법이다

## static 멤버변수(클래스 변수)

static 멤버변수는 '클래스 변수'라고도 한다. 일반적인 멤버변수와 달리 클래스당 하나씩만 생성되기 때문.

다음 코드 예제를 보자.

```cpp
class Simple
{
private:
	static int simObjcnt;
public:
	Simple()
	{
		simObjcnt++;
	}
};

int Simple::simObjcnt = 0; // 클래스 외부에서 초기화!!

int main(void)
{
	Simple s;
	Simple s1 = s;
	Simple s2 = Simple();
	return 0;
}
```

위의 코드에서 선언된 static 변수는 Simple 객체가 생성될때마다 생성되는 변수가 아니라, 객체를 생성하건 생성하지 않건

메모리 공간에 딱 하나만 할당되어서 공유되는 변수이다.

예를들어 위와 같이 s,s1,s2 객체가 생성되면 아래처럼 simObjcnt를 공유하는 구조가 된다.

![[17-1.png]]

때문에 s,s1,s2 객체의 멤버함수(생성자)에서는 simObjCnt에 멤버변수 접근하듯이 접근이 가능하다.

**하지만 그렇다고 해서 객체내에 simObjCnt가 존재하는것은 아니다!**

**이 변수는 외부에 있다. 다만 객체에게 멤버 변수처럼 사용할 권한을 줬을 뿐이다.**

이렇듯 클래스안에 선언된 static변수는 모든 객체가 공유하는 구조이다.

그리고 생성 및 소멸의 시점도 전역변수와 동일하다.

#### 그럼 이제 static 변수를 생성자에서 초기화하면 안되는 이유에 대해 알아보자.

```cpp
Simple()
{
    simObjcnt = 0;
    simObjcnt++;
}
```

위와 같이 생성자를 정의한다면, 객체가 생성될때마다 simObjCnt는 0으로 초기화 된다.

왜냐하면 simObjCnt는 객체가 생성될때 동시에 생성되는 변수가 아니라 이미 메모리 공간에 할당되어 이뤄진 변수이기 때문이다. 그래서 static멤버변수의 초기화 문법은 다음과 같이 별도로 정의되어 있다.

```cpp
int Simple::simObjcnt = 0; // 클래스 외부에서 초기화!!
```

이는 Simple클래스의 static 멤버변수 simObjCnt가 메모리 공간에 할당될떄 0으로 초기화하라는 뜻이다.

## static 멤버변수의 또 다른 접근방법

static 멤버변수는 어디서든 접근이 가능한 변수이다. 위의 예제처러 private영역에 선언되면 해당 클래스의 객체들만 접근이 가능하지만, public으로 선언되면 **클래스의 이름 또는 객체의 이름을 통해서 어디서든 접근이 가능하다.**

```cpp
class Simple
{
public:
	static int simObjcnt;
public:
	Simple()
	{
		simObjcnt++;
	}
};

int Simple::simObjcnt = 0; // 클래스 외부에서 초기화!!

int main(void)
{
	cout << Simple::simObjcnt << endl; // 클래스 명으로 접근가능
	Simple s;
	Simple s1;

	cout << s.simObjcnt << endl; // 객체이름으로 접근가능
	cout << s1.simObjcnt << endl; // 객체이름으로 접근가능
	return 0;
}
```

위 코드를 보면 객체를 하나도 생성하지 않고 클래스 명으로 바로 접근이 가능하다.

물론 객체를 생성한 후 객체이름으로도 접근이 가능하다.

하지만 이러한 객체이름으로 접근하는 방법은 추천하지 않는다, 멤버변수로 오해를 불러 일으킬수도 있기 때문이다.

## static 멤버함수

static 멤버함수도 static멤버변수와 동일하다.

- 선언된 클래스의 모든 객체가 공유한다.
- public으로 선언이 되면, 클래스의 이름을 이용해서 호출이 가능하다
- 객체의 멤버로 존재하는것이 아니다.

여기서 중요한점은 객체의 멤버로 존재하지 않는다는 점이다

아래 코드를 보자

```cpp
class Simple
{
private:
	int num;
	static int num2;
public:
	Simple(int n) : num(n) {}
	
	static void AddNum(int n)
	{
		num += n; // Error!!
	}
};
```

해당코드는 num += n; 이부분에서 컴파일 에러가 발생한다.

AddNum이 멤버함수가 아닌데 어떻게 멤버변수에 접근하겠는가??

객체생성 전에도 함수 호출이 가능한데 어떻게 멤버변수에 접근하겠는가

멤버변수에 접근을 할수있다 치더라도 어떤 객체의 멤버에 접근해야 하는가?

다음과 같이 논리적으로 잘못됐다는것을 알 수 있다.

> static 멤버함수 내에서는 static멤버변수, static멤버함수만 호출이 가능하다.

## const static 멤버

앞서 const 멤버변수의 초기화는 선언과 동시에 초기화가 이루어지기 때문에 이니셜라이저를 통해야만 한다 했다.

그러나 const static 으로 선언되는 멤버변수는 다음과 같이 선언과 동시에 초기화가 가능하다.

```cpp
class CountryArea
{
public:
	const static int KOREA = 0;
	const static int JAPAN = 1;
	const static int CHINA = 2;
};
```

static은 클래스 외부에서 초기화해야 한다더니 const를 붙이면 클래스 내에서 초기화가 가능하다??

잘 이해가 안갈수 있지만 예외적으로 문법을 허용했다한다.

const 변수는 선언과 동시에 초기화과 이뤄져야 한다는 성질과 + static은 객체 생성과 상관없이 메모리에 저장된다는 성질을 합한거 같음.

## 키워드 mutable

이 키워드는 가급적 사용의 빈도수를 낮춰야 하는 키워드이다.

일단 이 키워드의 의미는 아래와 같다.

> const 함수 내에서의 값의 변경을 예외적으로 허용한다

```cpp
class Simple
{
private:
	mutable int num1;
public:
	void Add() const
	{
		num1++;
	}
};
```

위 코드와 같이 Add는 const 함수로서 원래는 멤버변수에 대해 수정이 불가한 함수이다.

하지만 멤버변수 num1은 mutable 키워드로 선언되어 const함수내에서 num1에 대한 변경이 예외적으로 가능해진 것이다.

의미만 이해하고 가급적 사용하지 말자.
