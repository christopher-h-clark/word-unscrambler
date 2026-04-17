# BMAD Opinions

## Overview

After excessive scope creep on my first BMAD experiment, I started a much simpler BMAD experiment.
I see a lot of value in the brainstorming and advanced elicitation features of BMAD, *but* they must be employed judiciously, as it's easy for them to lead to unanticipated increase in scope.
I specifically focused on my idea, resisting BMAD's attempts to get me to think through features to differentiate my project from the many similar sites already available.

What I'm implementing here is a simple word unscrambler, inspired by [Word Unscrambler](https://wordunscrambler.me/).
It's super simple, accepting 3-7 letters, and unscrambling them against a dictionary.

## Questions

This experiment was to answer four questions:

1. What did you like or dislike about the process?
2. What did AI do well, and where did it fail?
3. What would you clean up in the code if you were to ship this project?
4. What would you do differently if you were to do this again?

### What did you like or dislike about the process?

#### What I Liked

* This time, it seemed to move quite a bit faster than the first time, in part because I wasn't trying to use all of the advanced elicitation methods at each step.

#### What I Disliked

### What did AI do well, and where did it fail?

#### What AI Did Well

* It respected my wishes to keep things simple, even generating its own statements to that effect.

* I was surprised at the quality of the UX examples the AI generated.
Typography was extremely simple and the most sophisticated background was a gradient, but it looked far better than I expected.
I was envisioning a left-aligned layout with some sort of image to the right, but went with a centered layout with a gradient because I didn't want to spend extra time generating a background image.

#### Where AI Failed

* Context built quickly.
I saw something about keeping context below 20%, but it hit 20% in the first step of writing a document.
It seemed to forget things I told it previously, so it either failed to write it down in the Project Context or PRD, or it got lost in the context.

* I changed my mind about the word length, switching from 3-10 letters to 3-7 letters, but the API specification wasn't updated to reflect that.
It would have been good for the AI to flag the inconsistency and ask if I wanted to stick with 3-10 letters or update the existing documents to indicate 3-7 letters.

* It put the `prd.md` document in the `planning_artifacts` directory but the `ux-design-directions.html` and `ux-design-specification.md` documents in the `planning-artifacts` directory.
I assume that the BMAD method will fix this inconsistency in a future update.

### What would you clean up in the code if you were to ship this project?

### What would you do differently if you were to do this again?

This time around, I minimized use of brainstorming and advanced elicitation features because I already had an idea that was well-developed and I wanted to keep it focused and simple.

Another experiment could be to start with an existing code base and see how it handles adding features, fixing defects, etc.
