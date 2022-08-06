# Notes


## Part0
Read lectures, all pretty clear. Gotta find time for the exercises.


### HTML
Attribute [reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes)


### CSS
- [selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors)
- [pseudo-classes](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes)
- [pseudo-elements](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements)


## Part1

A lot of things to keep track of: javasript vs react, react versions, firefox vs chrome (how do their dev environments differ?)

The way libraries in javascript (eg. React, JSX) modify the syntax of the language is **really** weird. 
It almost seems as though using React is different from using javascript, just the underlying engine is the same.


### Javascript

`let` seems to be important for closures, otherwise `var` can be used (global vs "block" scope)

object inheritance through prototyping is a little weird, gotta read about that some more

learning about `classes` and `this` (and old react?) might be useful at some later point, but not necessary for now
NOTE - classes are not first true constructs of the language -> so how does `this` work


### React

Basics seem quite straight forward, not sure how more complex state should be handled. That will probably come later.

-> look at function syntax at some point, the simplified syntax for "one liners" seems easy to misuse


## Part 2

The premise that "state" should be held as "high" as possible seems sound, but nothing so far explains how to do this in more complex cases. At the moment this seems to lead to a **huge** state held near **App**, very large components that get passed massively complex state one variable at a time.

Gotta wrap my head around Events (ie. button is pressed, form submitted?), UseEffect (response to an change in state but different from event?), and form actions




