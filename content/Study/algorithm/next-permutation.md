---
title: "[알고리즘] std::next_permutation ( 순열과 조합)"
date: 2025-03-17 23:53
category: "알고리즘/C++"
tags:
  - "next_permutation"
  - "순열과-조합"
  - "알고리즘"
source: https://devwogur.tistory.com/28
---
## 순열과 조합

원래 순열과 조합같은 경우의 수를 구하려면 DFS나 백트래킹을 이용해서 구현해야하지만

std::next_permutation 라는 함수를 통해 쉽게 순열과 조합을 구하는 방법이 있다.

해당 함수를 사용하기 위해서 알고리즘 헤더를 추가해줘야 한다.

```cpp
#include <algorithm>
```

## 순열 예시

1,2,3,4 라는 4개의 원소의 모든 수열을 구한다면

```cpp
int arr[4] = { 1,2,3,4 };
do
{
    for (int i = 0; i < 4; ++i)
        cout << arr[i] << ' ';

    cout << '\n';
} while (std::next_permutation(arr, arr + 4));
```

다음과 같이 사용할 수 있다.

next_permutation함수가 마지막 순서에 도달하여 다음 원소가 없다면 false를 반환하기 떄문에 do-while을 활용하면 된다.

인자로는 위와 같이 (시작주소,마지막 주소)를 넘겨주면 되기 떄문에 배열뿐아니라 vector도 사용가능하다.

**주의할점은 오름차순으로 정렬된 데이터를 넣어줘야 모든 경우의 수를 구할 수 있음**

실행결과

![[28-1.png]]

## 조합 예시

조합같은 경우는 바로 next_permutation에 사용할 수 없어서 다음과 같이 0,1로 이루어진 배열을 활용하면 된다.

4개중2개를 고르는 경우는 아래와 같이 a배열에 고르려는 갯수만큼 0을 넣어 구성하고.

해당 배열을 next_permutation함수의 인자로 넘겨주면 된다.

```cpp
int a[4] = { 0,0,1,1 };
int arr[4] = { 1,2,3,4 };
do
{
    for (int i = 0; i < 4; ++i)
        if( a[i] == 0)
            cout << arr[i] << ' ';

    cout << '\n';
} while (std::next_permutation(a, a + 4));
```

실행결과

![[28-2.png]]

레퍼런스

[https://en.cppreference.com/w/cpp/algorithm/next_permutation](https://en.cppreference.com/w/cpp/algorithm/next_permutation)
