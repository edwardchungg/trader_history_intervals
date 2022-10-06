# trader_history_intervals

## This is a portion of code from my coin trader project.


### The goal of the project is to create a paper trading platform for crypto.


### The issue I was trying to tackle was that I wanted to store users' portfolio history efficiently. Instead of having a table that contains the history of users' portfolio values, I tried to work backwards using the assets, cash, and trades that each user has to create a function that could generate intervals that show what a user owns at different intervals of time. From there, the client would call from the CoinGecko API and receive historical prices for each coin and utilize the intervals to calculate what the portfolio was worth at each moment in time.
