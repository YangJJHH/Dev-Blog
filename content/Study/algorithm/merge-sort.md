---
title: "[알고리즘] Merge Sort"
date: 2025-03-19 22:32
category: "알고리즘/C++"
tags:
  - "c++"
  - "Merge-sort"
  - "머지소트"
  - "정렬"
source: https://devwogur.tistory.com/32
---
## MergeSort

머지소트의 알고리즘은 다음과 같다.

7,10,11,12,2,4,5,6 와 같은 배열이 있을때 배열을 정렬하기 위해 하나의 배열로 생각하는 것이 아니라 두개의 배열로 나누어 생각해보자

7,10,11,12 => 크기가 N이라 가정

2,4,5,6 => 크기가 M이라 가정

과 같이 크기가 비슷하게 둘로 나누고, 두 배열이 정렬이 되어있다고 가정해보자.

이렇게 되면 두 배열에서 가장 작은 원소들은 가장 앞에 위치하므로 가장 작은 원소를 찾기 위해 O(N+M)의 탐색을 갖는게 아니라, 두 배열의 가장 앞의 원소를 비교만 하면 되므로 O(1)에 가능하다.

그 이후로 각각 두 배열의 가장 앞의 원소만을 비교하여 정렬 할 수 있게 된다.

그럼 만약 두 배열이 정렬되어 있지 않다면 각각배열을 다시 길이가 균일하게 2개의 배열들로 나누어주고 크기가 1일때까지 나누어 준 후 위의 과정처럼 크기가 작은 순으로 합쳐주고 이 과정을 재귀적으로 반복하여 구현할 수 있다.

그래서 요약하자면

1. 배열을 2개의 배열로 나눈다.

2. 각각의 부분배열을 정렬시킨다.

3. 부분배열을 비교하여 하나의 배열로 합친다.

동작 방식

![[32-1.gif]]

*출저 : 위키피디아*

![[32-2.png]]

예시코드

```cpp
int arr[8] = { 7,1,3,4,2,10,19,20 };
int temp[8];

void Merge(int start, int end)
{
    int mid = (start + end) / 2;
    int lidx = start;
    int ridx = mid;
    for (int i = start; i < end; ++i)
    {
        if (ridx == end) temp[i] = arr[lidx++];
        if (lidx == mid) temp[i] = arr[ridx++];
        else if (arr[lidx] > arr[ridx]) temp[i] = arr[ridx++];
        else temp[i] = arr[lidx++];
    }

    for (int i = start; i < end; ++i)
    {
        arr[i] = temp[i];
    }
}

void Merge_Sort(int start, int end)
{
    if (end == start + 1) return;

    int mid = (start + end) / 2;
    Merge_Sort(start, mid);
    Merge_Sort(mid, end);
    Merge(start, end);
}


int main()
{
    // 머지 정렬
    
    int n = 8;
    Merge_Sort(0, 8);
    
    for (auto ele : arr)
        cout << ele << ' ';

    return 0;
}
```
