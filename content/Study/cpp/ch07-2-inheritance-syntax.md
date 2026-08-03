---
title: "[윤성우의 열혈 C++] Chapter 07-2 상속의 문법적인 이해"
date: 2025-02-27 15:18
tags:
  - "c++"
  - "객체생성과정"
  - "객체소멸과정"
  - "기초클래스"
  - "상속"
  - "유도클래스"
---
우선 예제코드를 통해 상속 받는 과정을 알아보자

```cpp
class Person
{
private:
	int age;
	char name[32];
public:
	Person(int _age, const char*_name) : age(_age)
	{
		strcpy(name, _name);
	}
	void ShowData()
	{
		cout << age << name << endl;
	}
};

class UnivPerson : public Person	// Person 클래스의 상속을 의미함 
{
private:
	char major[50];
public:
	UnivPerson(const char* name, int age, const char* major)
		: Person(age, name)
	{
		strcpy(this->major, major);
	}

	void ShowInfo()
	{
		ShowData();
		cout << major << endl;
	}
};
```

상속받은 객체는 상속의 대상이 되는 클래스의 멤버까지도 객체내에 포함이 된다.

따라서 UnivPerson클래스 생성자는 Person클래스의 멤버까지 초기화해야 의무가 있다

위의 코드에서는 UnivPerson클래스에서 이니셜라이저를 통해 Person클래스 멤버를 초기화 시키는데 이것이 의미하는 바는 생성자의 호출이다. 즉 Person클래스의 생성자를 호출하며 age,name에 저장된값을 인자로 넘기는 것이다.

이렇듯 상속받는 클래스는 이니셜라이저를 통해 클래스의 생성자 호출을 명시 할 수 있다.

다음은 상속과 관련된 용어의 정리이다

![[18-1.png]]

## 유도 클래스의 객체 생성과정

```cpp
class Base
{
private:
	int baseNum;
public:
	Base() : baseNum(20)
	{
		cout << "Base()" << endl;
	}
	Base(int n) : baseNum(n)
	{
		cout << "Base(int n)" << endl;
	}
};

class Derived : public Base
{
private:
	int derivNum;
public:
	Derived() : derivNum(30)
	{
		cout << "Derived()" << endl;
	}
	Derived(int n) : derivNum(n)
	{
		cout << "Derived(int n)" << endl;
	}
	Derived(int n1, int n2) : Base(n1), derivNum(n2)
	{
		cout << "Derived(int n1, int n2)" << endl;
	}
};


int main(void)
{
	Derived d1;
	cout << "==================" << endl;
	
	Derived d2(12);
	cout << "==================" << endl;
	
	Derived d3(13,14);
	cout << "==================" << endl;

	return 0;
}
```

실행결과

![[18-2.png]]

소스코드와 실행결과를 살펴보면 다음 두가지 사실을 알 수 있다.

- 유도클래스의 객체생성 과정에서 기초 클래스의 생성자는 100% 호출된다.
- 유도클래스의 생성자에서 기초클래스의 생성자 호출을 명시하지 않으면, 기초클래스의 void생성자가 호출된다.

유도클래스의 객체 생성과정에서는 생성자가 두번 호출된다. 하나는 기초클래스 생성자, 다른하나는 유도클래스 생성자

그럼 다음 문장의 객체생성 과정을 함께보자

```cpp
Derived d3(13,14);
```

기본적으로 메모리 공간이 할당된 다음에 생성자 호출되어야 하니, 첫번째로 메모리 공간이 할당이 진행된다.

기초클래스와,멤버 클래스의 멤버에 대한 메모리 공간할당 진행

그 다음 이어서 생성자가 호출되면 상속관계를 파악해 기초클래스의 생성자 호출을 위해 이니셜라이저를 살피게 된다.

이니셜라이저를 통해 값을 전달 받아 기초클래스의 생성자 호출이 완료되고 기초클래스의 멤버변수가 먼저 초기화 된다.

그 이후 유도클래스의 생성자 실행이 완료되면서 유도클래스의 멤버변수도 초기화가 완료된다.

여기까지 진행되어야 비로소 객체라 부를 수 있는 상태가 되는 것이다.

## 유도 클래스 객체의 소멸과정

```cpp
class Base
{
private:
	int baseNum;
public:
	Base() : baseNum(20)
	{
		cout << "Base()" << endl;
	}
	Base(int n) : baseNum(n)
	{
		cout << "Base(int n)" << endl;
	}
	~Base()
	{
		cout << "~Base()" << endl;
	}
};

class Derived : public Base
{
private:
	int derivNum;
public:
	Derived() : derivNum(30)
	{
		cout << "Derived()" << endl;
	}
	Derived(int n) : derivNum(n)
	{
		cout << "Derived(int n)" << endl;
	}
	Derived(int n1, int n2) : Base(n1), derivNum(n2)
	{
		cout << "Derived(int n1, int n2)" << endl;
	}
	~Derived()
	{
		cout << "~Derived()" << endl;
	}
};


int main(void)
{
	Derived d1;
	cout << "==================" << endl;
	
	Derived d2(12);
	cout << "==================" << endl;

	return 0;
}
```

실행결과

![[18-3.png]]

위의 실행결과를 통해 알 수있는 사실은 다음과 같다.

- 유도 클래스의 객체가 소멸될 떄에는, 유도클래스의 소멸자가 실행되고 난 다음에 기초 클래스의 소멸자가 호출된다.
- 스택에 생성된 객체의 소멸순서는 생성순서와 반대이다.

여기서 중요한점은 기초클래스,유도클래스 소멸자 모두 호출된다는 사실이다. 그리고 이러한 객체소멸의 특성 때문에 상속과 연관된 클래스의 소멸자는 다음의 원칙을 지켜서 정의해야 한다.

- 생성자에서 동적할당한 메모리 공간은 소멸자에서 해제한다.
