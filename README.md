# intervallo

I developed this app as the final project for the coding bootcamp I attended in Q1 2021. I wanted to make an ear trainer that uses only positive reinforcement (i.e. no signalling to the user that they made a mistake) because I have read a few articles on the negative effects of the concept of "mistake" on natural learning processes and I wanted to experiment on ear training, which I have personally found very frustrating in the past.

I decided to provide positive reinforcement in two ways: by reproducing the answer to the user immediately after picking it, and by adapting the questions to the user's answer history (the probability that an interval is included in a question set depends on the correct / wrong ratio, plus a correction factor for intervals that have been practiced less than 20 times).

Since the stored data is not very sensitive, I decided for simple authentication via OTP sent to the user's e-mail.

In the near future I would like to rewrite the app in Vue 3, improve the user experience, and improve the weighting algorithm.
