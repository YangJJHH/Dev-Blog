---
title: "[알고리즘] Quick Sort"
date: 2025-03-19 23:41
category: "알고리즘/C++"
tags:
  - "c++"
  - "Quicksort"
  - "정렬"
  - "퀵정렬"
source: https://devwogur.tistory.com/33
---
## Quick Sort

퀵소트는 대부분의 정렬 알고리즘보다 훨씬 빠르기 때문에 많은 라이브러리에서 활용한다.

퀵소트는 머지소트와 비슷하게 재귀적으로 구현할 수 있다.

우선 퀵소트의 장점을 보자면

- 속도가 빠르다
- 머지소트와 다르게 추가적인 메모리 공간 필요없이 정렬이 가능하다
- 추가적인 공간이 필요하지 않기에 cache-hit-rate가 높다.

#### 알고리즘 원리

퀵소트 같은 경우는 Pivot이되는 기준 원소를 두고 left,right 라는 원소를 가르키는 포인터를 두어

left는 pivot보다 큰원소를 찾고 right는 pivot보다 작은 원소를 찾은 후 서로 자리를 바꾼다.

그 이후 right가 left보다 왼쪽에 위치 할 경우 right와 pivot의 자리를 바꾸게 되는데 이러면

pivot을 기준으로 왼쪽은 pivot보다 작은값 오른쪽 pivot보다 큰값이 자리하게된다.

![[33-1.png]]

예시코드

```cpp
void Quick_Sort(int start, int end)
{
    if (start + 1 >= end) return;

    int pivot = arr[start];
    int l = start + 1;
    int r = end - 1;

    while (true)
    {
        while (l <= r && arr[l] <= pivot) l++; // pivot보다 큰값이 나올때까지
        while (l <= r && arr[r] >= pivot) r--; // pivot보다 작은값이 나올떄까지
        if (l > r) break; // r이 l보다 왼쪽에 있으면
        
        std::swap(arr[l], arr[r]); // 서로 원소를 찾으면 자리바꾸기 
    }
    std::swap(arr[start], arr[r]);
    Quick_Sort(start, r);
    Quick_Sort(r+1, end);
}


int main()
{
    // 머지 정렬
    
    int n = 8;
    Quick_Sort(0, n);
    
    for (auto ele : arr)
        cout << ele << ' ';

    return 0;
}
```
