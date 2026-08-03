---
title: "[윤성우의 열혈 C++] Chapter 08-2 가상함수"
date: 2025-02-27 22:16
category: "Language/C++"
tags:
  - "c++"
  - "가상소멸자"
  - "가상함수"
  - "가상함수테이블"
  - "다형성"
  - "순수가상함수"
  - "추상클래스"
source: https://devwogur.tistory.com/20
---
아래 코드를 보자

```cpp
Base* b = new Derived();
b->DerivedFunc(); // Error!
```

첫번째 문장은 기초클래스 형 포인터로 유도클래스 객체를 참조하므로 문제없이 컴파일된다.

하지만 두번째 문장에서는 컴파일 에러를 발생시킨다.

왜냐하면 b는 Base형 포인터이기 때문이다

그래도 실제로 가리키는 대상은 Derived객체이니깐 위의 문장이 컴파일되어야 정상 아닌가 생각이 들수있는데

#### C++ 컴파일러는 포인터연산의 가능성 여부를 판단 할 떄, 포인터의 자료형을 기준으로 판단한다.

즉 실제 가르키는 객체의 자료형을 기준으로 판단하지 않는다.

따라서 다음 코드도 컴파일 에러를 발생시킨다

```cpp
Base* b = new Derived();
Derived* ptr = b; // Error!
```

포인터 b의 포인터 형만을 가지고 대입의 가능성을 판단하기 때문이다.

컴파일러는 b포인터가 실제로 가르키는 객체가 Derived객체라는 사실을 기억하지 않는다. 그리고 다음과 같이 판단한다

> b는 Base형 포인터니깐 b가 가르키는 대상은 Base 객체일 수도 있다 그럴경우에는 문장이 성립되지 않으므로 컴파일 에러 발생!

반면 다음 코드는 가능하다

```cpp
Derived* d = new Derived();
Base* ptr = d;
```

d는 Derived형 포인터이기 때문에 이 포인터가 가르키는 객체는 분명 Base를 직간접적으로 상속하는 객체이다.

따라서 Base형으로 참조가 가능하다

하나더 복습을 해보자면

```cpp
class Person
{
public:
	void Sleep() {}
};
class Student : public Person
{
public:
	void Study() {}
};
class PartTimeStudent : public Student
{
public:
	void Work() {}
};
int main(void)
{
	PartTimeStudent* pts = new PartTimeStudent;
	Student* st = pts;
	Person* p = st;

	pts->Sleep();	// Ok
	pts->Study();	// Ok	
	pts->Work();	// Ok

	st->Sleep();	// Ok
	st->Study();	// Ok	
	st->Work();		// Error

	p->Sleep();		// Ok
	p->Study();		// Error	
	p->Work();		// Error

	return 0;
}
```

위와 같이 객체를 참조하는 포인터의 형에 따라 호출할수 있는 제한이 따른다.

> 결론적으로 포인터 형에 해당하는 클래스에 정의된 멤버에만 접근이 가능한거이다

**다시 한번 말하지만 포인터를 이용한 연산의 가능성 여부는, 그 포인터가 실제 가르키는 대상이 아니라 포인터의 자료형 기준으로 판단한다!!**

## 가상함수(Virtual Function)

가상함수의 선언은 virtaul키워드로 가능하다.

예제를 보자

```cpp
class First
{
public:
	virtual void MyFunc() 
	{
		cout << "First()" << endl;
	}
};
class Second : public First
{
public:
	virtual void MyFunc()
	{
		cout << "Second()" << endl;
	}
};
class Third : public Second
{
public:
	virtual void MyFunc()
	{
		cout << "Third()" << endl;
	}
};
int main(void)
{
	Third* tptr = new Third;
	Second* sptr = tptr;
	First* fptr = sptr;

	tptr->MyFunc(); // 동적 바인딩
	sptr->MyFunc();
	fptr->MyFunc();

	return 0;
}
```

실행결과

![[20-1.png]]

위의 실행결과를 보면, 함수가 가상함수로 선언되면 포인터의 자료형을 기반으로 호출대상을 결정하지 않고, 포인터 변수가 실제로 가리키는 객체를 참조하여 호출의 대상을 결정한다.

만약 가상함수로 선언되지 않았다면 third() , second(), first() 순으로 출력됐을 것이다.

따라서 정리하자면,

오버라이딩이란 기초클래스의 함수와 동일한 함수를 유도클래스에 재정의하는것을 의미한다.

이로 인해 기초클래스의 함수는 유도클래스의 함수에 가려지게 된다. 하지만 단순 오버라이딩만으로는 정적바인딩을 통해 실제 포인터가 가르키는 객체의 함수를 호출할 수 없다.

이때 필요한게 virtual키워드를 통한 가상함수이다.

가상함수로 선언한 함수를 유도클래스에서 오버라이딩하면, 이후 함수를 호출할때 실제 포인터가 가르키는 객체의 함수로 동적바인딩이 되어 실행하게된다.

## 순수 가상함수와 추상클래스

```cpp
virtual int GetPay()
{
	return 0;
}
```

어떤 기초클래스에 다음과 같이 함수가 있다 가정하자.

이 함수는 유도클래스에서 오버라이딩하여 각 객체마다 다르게 동작하게끔 유도하려고 만든 함수일 것이다.

가상함수 오버라이딩을 위해서 기초클래스에 선언은 하였지만, 기초클래스 내부에선 실제 기능이 없다.

이런경우 프로그래머의 실수로 기초클래스의 GetPay를 직접 호출해도 컴파일러에선 따로 발견하지 못한다.

이런 상황에서 필요한 개념이 ***순수 가상함수***이다.

다음과 같이 가상함수를 순수 가상함수로 선언하여 객체의 생성을 문법적으로 막는 것이 좋다.

```cpp
virtual int GetPay() = 0; //  순수가상함수
```

> 순수 가상함수란 함수의 몸체가 정의되지 않은 함수를 의미한다.

하나 이상의 멤버함수를 순수가상함수로 선언한 클래스를 가리켜 ***추상클래스*** 라 한다.

이는 완전하지 않은, 그래서 객체생성이 불가능한 클래스라는 의미를 지닌다.

## 다형성(Polymorphism)

지금까지 설명한 가상함수의 호출관계에서 보인 특성을 ***다형성*** 이라한다.

다음의 의미를 갖고있다

> "모습은 같은데 형태는 다르다"

C++에 적용하면

> "문장은 같은데 결과는 다르다"

위의 예제에서 main부분만 바꾸어 다형성을 예를 보자면 다음과 같다.

```cpp
int main(void)
{
	First* ptr = new First;
	ptr->MyFunc();

	delete ptr;

	ptr = new Third;
	ptr->MyFunc();
	return 0;
}
```

ptr->MyFunc(); 이라는 문장은 같지만 가상함수호출로 포인터가 실제 가르키고 있는 객체마다 실행결과 다르게 나온다.

이것이 바로 C++에서의 다형성의 예이다.

## 가상 소멸자와 참조자의 참조 가능성

가상함수 말고도 virtual 키워드를 붙여줘야 할 대상이 하나 더 있다. 그건 바로 소멸자이다.

즉 virtual선언은 소멸자에도 올 수 있다.

virtual로 선언된 소멸자를 가상 소멸자라 하는데 이것이 필요한 이유를 알아보자.

아래는 문제가 있는 코드이다

```cpp
class First
{
private:
	char* name;
public:
	First()
	{
		name = new char[20];
	}
	~First()
	{
		delete [] name;
		cout << "~First()" << endl;
	}
};
class Second : public First
{
private:
	char* name;
public:
	Second()
	{
		name = new char[20];
	}
	~Second()
	{
		delete [] name;
		cout << "~Second()" << endl;
	}
};
int main(void)
{
	First* ptr = new Second;
	delete ptr;

	return 0;
}
```

각 기초클래스와 유도클래스모두 생성자에서 할당한 메모리를 소멸자에서 잘 해제시켜주고 있다.

그럼 어떤 문제가 있을까??

ptr은 First형의 포인터 변수이고 실제로는 Second 객체를 가르키고 있다.

그런데 delete 할때 First형 포인터로 명령하니, First클래스의 소멸자만 호출되고 Second의 소멸자가 호출이 안되어 메모리 누수가 발생한다!

이러한 문제 때문에 소멸자에 vitrual키워드를 추가해줘야 한다.

가상함수와 마찬가지로 가장 상위에있는 기초클래스의 소멸자만 virtual로 선언하면 이를 상속하는 유도클래스의 소멸자들도 모두 가상소멸자로 선인이 된다.

그리고 가상소멸자가 호출되면, 상속의 계층구조상 맨아래에 존재하는 유도클래스의 소멸자가 대신 호출되면서, 기초클래스의 소멸자가 순차적으로 호출된다.

즉 위의 코드에서 Third 클래스를 하나 더 추가하고 소멸자를 virtual로 바꾼다면

```cpp
class First
{
private:
	char* name;
public:
	First()
	{
		name = new char[20];
	}
	virtual ~First()
	{
		delete [] name;
		cout << "~First()" << endl;
	}
};
class Second : public First
{
private:
	char* name;
public:
	Second()
	{
		name = new char[20];
	}
	~Second()
	{
		delete [] name;
		cout << "~Second()" << endl;
	}
};
class Third : public Second
{
private:
	char* name;
public:
	Third()
	{
		name = new char[20];
	}
	~Third()
	{
		delete[] name;
		cout << "~Third()" << endl;
	}
};
int main(void)
{
	First* ptr = new Third;
	delete ptr;

	return 0;
}
```

실행결과

![[20-2.png]]

실행결과처럼 가장 하위의 유도클래스의 소멸자부터 상위의 기초클래스 순으로 소멸자가 순차적으로 호출된다.

이렇듯 각 클래스의 소멸자가 호출되어 메모리해제를 올바르게 하여 메모리 누수를 방지할 수 있다.

## 참조자의 참조 가능성

앞서 C++에서는 xx형 포인터 변수는 xx형 객체뿐 아니라 xx를 직간접적으로 상속받는 모든 객체를 가르킬 수 있다 했다.

이러한 특성은 참조자에서도 나타난다.

예를 들어 다음과 같이 가능하다.

```cpp
Third t;
First& ref = t;
```

또한 참조자도 가상함수 개념이 그대로 적용된다.

ref로 일반 함수를 호출하게될 경우는 First클래스의 멤버함수만 호출되지만

ref로 가상함수를 호출하게될 경우는 ref가 실제로 가르키는 객체의 함수를 호출하게된다.

## 가상함수의 동작원리와 가상함수 테이블

가상함수의 동작원리르 이해하면, C++이 왜 C보다 느린이유를 조금이나마 알 수 있게 된다.

***우선 한가지 알고 넘어가야 할 점은 멤버변수는 객체 내에 존재하지만, 멤버함수는 객체마다 생성되는 것이 아니라 별도의 메모리 공간에 위치하고 객체들이 공유하는 형태를 취한다는 점이다.***

그럼 위의 개념을 갖고 다음 예제 코드를 보자

```cpp
class AAA
{
public:
	virtual void Func1() { cout << "Func1()" << endl; }
	virtual void Func2() { cout << "Func2()" << endl; }
};
class BBB : public AAA
{
public:
	virtual void Func1() { cout << "BBB::Func1()" << endl; }
	void Func3() { cout << "Func3()" << endl; }
};

int main(void)
{
	AAA* aptr = new AAA;
	aptr->Func1();

	BBB* bptr = new BBB;
	bptr->Func1();
	return 0;
}
```

AAA클래스에는 가상함수가 존재한다. 이렇듯 한 개 이상의 가상함수를 포함하는 클래스에 대해서는 컴파일러가 다음 그림과 같은 형태의 ***가상함수 테이블*** 이란 것을 만든다. 이를 간단히 ***V-Table(Virtual Table)*** 이라고도 한다.

이는 실제로 호출되어야 할 함수의 위치 정보를 담고 있는 테이블이다.

![[20-3.png]]

*AAA클래스의 가상함수 테이블*

위의 가상함수 테이블을 보면, key가 있고 value가 있다. 여기서 key는 호출하고자 하는 함수를 구분지어주는 구분자의 역할을 한다. 그리고 value는 구분자에 해당하는 함수의 주소정보를 알려주는 역할을 한다.

그래서 AAA객체의 Func1 함수를 호출하는 경우, 위의 테이블에서 첫번쨰 행의 정보를 참조하여 0x1024번지에 등록되어 있는 함수를 호출하게 되는 것이다!

그럼 이어서 BBB클래스를 보자 역시 한개이상 가상함수가 존재하므로 가상함수 테이블이 존재한다.

![[20-4.png]]

*BBB클래스의 가상함수 테이블*

위의 가상함수 테이블을 보면, 다음을 발견 할수 있다

"AAA클래스의 Func1 정보가 존재하지 않는다"

> 이렇듯 오버라이딩된 가상함수의 주소정보는 유도클래스의 가상함수테이블에 포함되지 않는다!!

따라서 오버라이딩된 가상함수를 호출하면, 무조건 마지막에 오버라이딩을 한 유도 클래스의 가상 멤버함수가 호출되는것이다.

## 가상함수 테이블이 참조되는 방식

앞선 예제를 실행하면, main함수가 호출되기 이전에 다음의 구조로 가상함수 테이블이 메모리 공간에 할당된다.

참고로 가상함수 테이블은 객체의 생성과 상관없이 메모리 공간에 할당된다. 이는 가상함수 테이블이 멤버함수의 호출에 사용되는 일종의 데이터이기 때문이다

![[20-5.png]]

*가상함수 테이블과 가상함수와의 관계*

그리고 이어서 main함수가 호출되어 객체가 생성되고 나면 다음의 구조로 참조관계를 구성한다.

![[20-6.png]]

*객체의 가상함수 테이블 참조*

위 그림에서 보여주듯이,

AAA객체에는 AAA클래스의 가상함수 테이블 주소값이 저장되고, BBB객체에는 BBB클래스의 가상함수 테이블의 주소값이 저장된다.

물론 이 주소값은 우리가 직접 참조할수 없다, 다만 내부적으로 필요에 의해서 참조되는 주소값이다.

BBB클래스의 가상함수 테이블을 살펴보면 오버라이딩된 AAA클래스의 Func1 주소정보가 없다 그래서 BBB클래스의 Func1 함수가 대신 호출되는데, 이것이 가상함수의 호출원리이다.

즉 결론을 짓자면

클래스마다 가상함수테이블이란것이 존재하고, 객체는 해당 가상함수테이블을 주소값을 받는 포인터를 갖고 있다.

그래서 가상함수호출이 이뤄지면 내부적으로 포인터를 통해 가상함수테이블을 참조하여 호출에 맞는 함수의 주소정보를 찾아 호출하는것이다
