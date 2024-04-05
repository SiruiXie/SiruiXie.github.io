# 相机投影模型

## 前置知识
### Homogeneous Coordinates（齐次坐标系）
我们通过在笛卡尔向量的末尾再添加一个`1`来获得这个向量的齐次坐标。$P\rightarrow P_h$:
$$
\begin{bmatrix}
X\\
Y\\
Z
\end{bmatrix}
\rightarrow
\begin{bmatrix}
X\\
Y\\
Z\\
1
\end{bmatrix}
$$
反之，如果要想将一个3D齐次坐标转换为2D笛卡尔坐标，除下来即可:
$$
\begin{bmatrix}
X\\
Y\\
W
\end{bmatrix}
\rightarrow
\begin{bmatrix}
X/W \\
Y/W
\end{bmatrix}, W \neq 0
$$
在齐次坐标的表示方法下，任何的常数与坐标相乘之后，都与相乘之前表示同一个点。这种表示方法在投影变换中具有天然的优势，因为投影变换中，射线上的任何一点投影后的位置都不会发生变化。
例如，从坐标系 $P_0$ 到坐标系 $P_1$ 的变换可以这样表达：
$$
P1 = RP_0 + t \rightarrow P_{h_1} = 
\begin{bmatrix}
R \ \ t \\
0 \ \ 1
\end{bmatrix}
P_{H_0}
$$
## 细节描述
一个场景的视图是通过将一个场景的3D点 $P_w$ 使用透视变换映射到 `image plane`上的，这样就可以形成一个2D平面上的像素点

在没有distortion的条件下，针孔相机模型的映射变换可以用以下这个公式表示:
$$
s\ p = A[R \ | \ t] P_w
$$
其中，$P_w$表示世界坐标系下的3D点，$p$是相机平面上的像素点，$A$是相机内参矩阵，$R$和$t$分别是translation和rotation，它们共同表述了从世界坐标系到相机坐标系的变换。$s$表示映射变换的任意缩放，不是相机模型的一部分。

相机内参矩阵 $A$ (也有地方写作 $K$)将相机坐标系下的3D点映射到相机平面的2D坐标系上:
$$
p = AP_c
$$
相机内参矩阵中包含的信息只有 $f_x,\ \  f_y, \ \ c_x, \ \ c_y$四个变量，分别表示焦距(focal length)和基准点(Principle Point)
$$
A = 
\begin{bmatrix}
f_x \ \ 0 \ \ c_x \\
0 \ \ f_y \ \ c_y \\ 
0 \ \ 0 \ \ 1
\end{bmatrix}
$$
所以,
$$
s
\begin{bmatrix}
u\\
v\\
1
\end{bmatrix}
 = 
\begin{bmatrix}
f_x \ \ 0 \ \ c_x \\
0 \ \ f_y \ \ c_y \\ 
0 \ \ 0 \ \ 1
\end{bmatrix}
\begin{bmatrix}
X_c\\
Y_c\\
Z_c
\end{bmatrix}
$$
注意，内参矩阵不依赖于场景和观测位姿。一旦有了正确的内参矩阵，它就可以重复使用。如果图像按照某个比值缩放，那这四个参数都应该乘以或者除以缩放比值。

联合旋转|平移矩阵是投影变换和齐次变换的矩阵乘积。这个3-by-4的投影变换矩阵将相机坐标下的3D点投影到归一化的2D图像平面内的点， 如下:

$$
Z_c
\begin{bmatrix}
x'\\
y'\\
1
\end{bmatrix}
=
\begin{bmatrix}
1 \ \ 0 \ \ 0 \ \ 1 \\
0 \ \ 1 \ \ 0 \ \ 0 \\
0 \ \ 0 \ \ 1 \ \ 0 \\
\end{bmatrix}
\begin{bmatrix}
X_c\\
Y_c\\
Z_c\\
1
\end{bmatrix}
$$

但是就这样操作一下是有一点浪费算力的。这个过程当中会加入外参 $R$ 和 $r$ 。它们共同表示从世界坐标系 $w$ 到相机坐标系 $c$ 的基变换：
$$
P_c = 
\begin{bmatrix}
R \ \ t\\
0 \ \ 1
\end{bmatrix}
P_w
$$
整个变换过程可表示为：
$$
\begin{bmatrix}
X_c\\
Y_c\\
Z_c\\
1
\end{bmatrix}
=
\begin{bmatrix}
r_{11} \ \ r_{12} \ \ r_{13} \ \ t_x\\
r_{21} \ \ r_{22} \ \ r_{23} \ \ t_y\\
r_{31} \ \ r_{32} \ \ r_{33} \ \ t_z\\
0 \ \ \ \ \ 0 \ \ \ \ 0  \ \ \ \ 1
\end{bmatrix}
\begin{bmatrix}
X_w\\
Y_w\\
Z_w\\
1
\end{bmatrix}
$$
