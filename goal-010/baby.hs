--factorial1 n = product [1..n]
--
--doubleMe x = x + x
--doubleUs x y = doubleMe x + doubleMe y
--doubleSmallNumber x = if x > 100
--  then x
--  else x * 2
--
--rileyShaw = "I am Riley Shaw"
---- This will not work since you can't redefine definitions
---- rileyShaw = "I am not Riley Shaw"
--
--a = [0,1,2,3,4,5]
--
--boomBangs xs = [ if x < 10
--    then "BOOM!"
--    else "BANG!"
--  | x <- xs
--  , odd x ]
--
--lucky :: (Integral a) => a -> String
--lucky 7 = "LUCKY NUMBER SEVEN!"
--lucky x = "Sorry, you're out of luck, pal!"
--
--sayMe :: (Integral a) => a -> String
--sayMe 1 = "One!"
--sayMe 2 = "Two!"
--sayMe 3 = "Three!"
--sayMe 4 = "Four!"
--sayMe 5 = "Five!"
--sayMe x = "Not between 1 and 5"
--
--factorial2 :: (Integral n) => n -> n
--factorial2 0 = 1
--factorial2 n = n * factorial2 (n - 1)
--
--addVectors :: (Num a) => (a, a) -> (a, a) -> (a, a)
--addVectors (x1, y1) (x2, y2) = (x1 + x2, y1 + y2)
--
--head' :: [a] -> a
--head' [] = error "Can't call head on an empty list, dummy!"
--head' (x:_) = x
--
--reverseList :: [a] -> [a]
--reverseList [] = []
--reverseList (x:xs) = reverseList xs ++ [x]
--
--tell :: (Show a) => [a] -> String
--tell [] = "The list is empty"
--tell (x:[]) = "The list has one element: " ++ show x
--tell (x:y:[]) = "The list has two elements: " ++ show x ++ " and " ++ show y
--tell (x:y:_) = "This list is long. The first two elements are: " ++ show x ++ " and " ++ show y
--
--length' :: (Num b) => [a] -> b
--length' [] = 0
--length' (_:xs) = 1 + length' xs
--
--sum' :: (Num a) => [a] -> a
--sum' [] = 0
--sum' (x:xs) = x + sum' xs
--
--coinAmounts = [ 2, 1, 0.25, 0.1, 0.05, 0.01 ]
--amount = 2
--coinList = []
--returnChange :: (Num a) => a -> [a] -> [a]
--returnChange (x:xs) =
--  | x > amount = returnChange xs
--
--    0
--    else
--      x:coinList
--      returnChange x:xs
--      0

bmiTell :: (RealFloat a) => a -> a -> String
bmiTell weight height
    | bmi <= skinny = "You're underweight, you emo, you!"
    | bmi <= normal = "You're supposedly normal. Pffft, I bet you're ugly!"
    | bmi <= fat    = "You're fat! Lose some weight, fatty!"
    | otherwise     = "You're a whale, congratulations!"
    where bmi = weight / height ^ 2
          skinny = 18.5
          normal = 25.0
          fat = 30.0

calcBmis :: (RealFloat a) => [(a, a)] -> [a]
calcBmis xs = [bmi w h | (w, h) <- xs]
    where bmi weight height = weight / height ^ 2


reverseList (x:xs) currentList
  | xs == []  = x:currentList
  | otherwise = reverseList xs (x:currentList)

maximum' :: (Ord a) => [a] -> a
maximum' [] = error "maximum of empty list"
maximum' [x] = x
maximum' (x:xs)
    | x > maxTail = x
    | otherwise = maxTail
    where maxTail = maximum' xs

replicate' :: (Num i, Ord i) => i -> a -> [a]
replicate' n x
  | x == 0    = [x]
  | otherwise = x : replicate' (n-1) x
