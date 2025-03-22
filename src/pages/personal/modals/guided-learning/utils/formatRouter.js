
import { TARGET_PERFECT_LEVEL } from "../../../../../constants"

export default (level) => {
    switch (level % TARGET_PERFECT_LEVEL) {
      case 1: return  {
        quizLength: 'short',
        route: 'quiz-short-guess',
        quizType: 'example'
      }
      case 2: return {
        quizLength: 'long',
        route: 'quiz-long-guess',
        quizType: 'meaning'
      }
      case 3: return {
        quizLength: 'long',
        route: 'quiz-long-guess',
        quizType: 'example'
      }
      case 4: return {
        quizLength: 'short',
        route: 'quiz-short-mcq',
        quizType: 'meaning'
      }
      case 5: return {
        quizLength: 'short',
        route: 'quiz-short-mcq',
        quizType: 'example'
      }
      case 6: return {
        quizLength: 'long',
        route: 'quiz-long-mcq',
        quizType: 'meaning'
      }
      case 7: return {
        quizLength: 'long',
        route: 'quiz-long-mcq',
        quizType: 'example'
      }
      case 8: return {
        quizLength: 'short',
        route: 'quiz-long-mcq',
        quizType: 'synonym'
      }
      default: return {
        quizLength: 'short',
        route: 'quiz-short-guess',
        quizType: 'meaning'
      } 
    }
  }