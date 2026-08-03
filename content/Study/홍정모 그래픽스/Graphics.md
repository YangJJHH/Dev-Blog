```dataview
TABLE without id
	tags as "파트",
	file.link as "내용", 
	file.cday as "생성 날짜", 
	file.mday as "수정 날짜"

FROM "홍정모 그래픽스"

SORT file.ctime
```