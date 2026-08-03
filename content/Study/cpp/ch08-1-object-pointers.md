---
title: "[윤성우의 열혈 C++] Chapter 08-1 객체 포인터의 참조관계"
date: 2025-02-27 16:14
category: "Language/C++"
tags:
  - "c++"
  - "객체-포인터"
  - "함수오버라이딩"
source: https://devwogur.tistory.com/19
---
```cpp
Person* ptr;
ptr = new Person();
```

위의 코드가 실행되면, 포인터 ptr는 Person객체를 가리키게 된다. **그런데 Person형 포인터는 Person객체 뿐 아니라 Person을 상속하는 유도 클래스의 객체도 가리킬수 있다.**

> C++에서, xx형 포인터 변수는 xx객체 또는 xx를 직접 혹은 간접적으로 상속하는 모든 객체를 가르킬 수 있다.

그렇다면, 어떻게 이러한 일이 가능한 것일까?? 예제를 보며 알아보자

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
	Person* ptr1 = new Student;
	Person* ptr2 = new PartTimeStudent;
	Student* ptr3 = new PartTimeStudent;

	ptr1->Sleep();
	ptr2->Sleep();
	ptr3->Study();

	delete ptr1;
	delete ptr2;
	delete ptr3;

	return 0;
}
```

위의 코드를 보면 PartTimeStudent => Student => Person 과 같은 상속 구조를 보이고 있다

상속구조는 IS-A 관계이므로,

PartTimeStudent 은 Student 이다

Student는 Person이다

PartTimeStudentnbsp;는 Person이다

라고 논리적으로 설명할 수 있다.

그래서 위의 코드와 같이 기초클래스형 포인터 변수로 유도클래스 객체들을 가르킬 수 있는 것이다.

위의 코드에서 살짝 바꾸어 함수오버라이딩에 대해 잠깐 보겠다.

```cpp
class Person
{
public:
	void Sleep() {}
	void ShowInfo()
	{
		cout << "Person" << endl;
	}
};
class Student : public Person
{
public:
	void Study() {}
	void ShowInfo()
	{
		cout << "Student" << endl;
	}
};
class PartTimeStudent : public Student
{
public:
	void Work() {}
	void ShowInfo()
	{
		cout << "PartTimeStudent" << endl;
	}
};
int main(void)
{
	PartTimeStudent* ptr1 = new PartTimeStudent;
	ptr1->ShowInfo(); 

	delete ptr1;
	return 0;
}
```

코드를 보면 기초클래스와 유도클래스에 동일한 형태와 이름의 함수 ShowInfo()가 있다.

**이를 가리켜 함수 오버라이딩이라한다. 이렇듯 함수가 오버라이딩 되면 오버라이딩된 기초 클래스의 함수는, 오버라이딩 한 유도클래스 함수에 가려진다.**

따라서 위의 실행결과로는 "PartTimeStudent"가 나오게 된다
