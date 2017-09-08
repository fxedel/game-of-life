# Game of Life
## An implementation by *Felix Edelmann*

### Motivation
There are already a lot of [Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life) simulators around there (a GitHub search after "Conway's Game of Life" gives 5,713 repository results). There are simple scripts for the shell and massive advanced 3D adoptions that work with newest HTML5 technlogies. It obviously is a quite popular programming task – so I can't be missing it and present my own implementation using Node.js.

### Implementation
I'm using a simple dependency-free [Node.js](https://nodejs.org/) script. It's capable of parsing start generation files in this format:

```
      
  OO  
 O  O 
  O O 
   O  
      
```

I'm using the new [ES2015 class syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) to represent a Game of Life instance. This `GameOfLife` object holds a two-dimensional array of `Cell` class instances. A `Cell` only has the `alive` property determining whether this cell lives or not.

The `GameOfLife` regularly calculates the next round by checking which cells have to die and which have to be born following Conway's rules.

After creation and after each round, the current field is printed as a ASCII representation to the console, in the same format like the start generation files.

If an `GameOfLife` instance is stable, meaning that it doesn't change anymore (this also includes the case that there is no living cell anymore), the program stops.

### Usage
#### Setup
The script was developed with Node v6.11.1, it should also work with at least v6.4.0. You can download the newest LTS (I recommend this version) here: https://nodejs.org/en/download/

#### Running
```
$ node index.js <path/to/start-generation.txt>`

e.g.
$ node index.js samples/rocket.txt`
```

There are already some example start generation files available in the samples directory or you can use your own txt files in the above described format.