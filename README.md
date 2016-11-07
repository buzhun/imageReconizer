# imageReconizer

js识别canvas画布上绘制的图形

基本方法：

（1）多边形识别

首先选取特征点，然后根据数学边角关系计算，最后进行匹配。

优点：准确度高，支持判断canvas画布上绘制出来的图形是否是三角形，矩形，横线，竖线，对勾等。

缺点：对复杂图形的匹配，计算上很麻烦。


（2）复杂图形识别

先对图形进行学习，获得学习到的模版。然后进行图形相似度匹配，图形匹配根据$1 Unistroke Recognizer技术来判断出图形间的边角以及旋转后的相似度。

优点：支持图形学习，实现简单。

缺点：样例图形间相似度高时，匹配不准确。

$1 Unistroke Recognize使用方法：

（1）将绘制心形的所有的点points传入AddGesture方法中。

Recognizer.AddGesture('心形',points)

统一类型可以支持传入多份点的数据。

（2）图形识别

Recognizer.Recognize(points,true)

可以得到图形检测name和score返回值。

实践：
实现根据给出的图形，涂鸦图形的闯关益智小游戏。

微信好友之间，涂鸦相似度评比等。

