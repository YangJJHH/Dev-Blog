---
title: "[알고리즘] 선택정렬"
date: 2025-03-19 21:16
category: "알고리즘/C++"
tags:
  - "c++"
  - "선택정렬"
  - "정렬"
source: https://devwogur.tistory.com/31
---
## 선택정렬

선택 정렬은 가장 직관적인 정렬 방법 중 하나이다.

첫번째 자리에는 가장 작은 원소를 찾아 위치, 두번쨰 자리에는 그 다음으로 작은 원소를 찾아 위치...

와 같은 방식으로 정렬하는 알고리즘이다.

작동방식

![[31-1.gif]]

*출저 : 위키피디아*

각 자리마다 가장 작은 원소들을 찾는 과정이 필요하므로 시간복잡도는 O(N^2)가 된다.

예시코드

```cpp
// 선택 정렬
int arr[5] = { 7,1,3,4,2 };
int n = 5;
for (int i = 0; i < n; ++i)
{
    int min_idx = i;
    for (int j = i+1; j < n; ++j)
    {
        if (arr[min_idx] > arr[j]) // 가장 작은원소 위치찾기
            min_idx = j;
    }
    std::swap(arr[i], arr[min_idx]);
}
```
