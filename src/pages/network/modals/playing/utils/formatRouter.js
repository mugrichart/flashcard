export default (lev) => {
    const level = lev % 6
    switch (level) {
      case 0: return {
              quizLength: 'short',
              route: 'quiz-short-mcq',
              quizType: 'meaning'
            }
      case 1: return {
              quizLength: 'short',
              route: 'quiz-short-mcq',
              quizType: 'example'
            }
      case 2: return {
              quizLength: 'long',
              route: 'quiz-long-mcq',
              quizType: 'meaning'
            }
      case 3:  return {
              quizLength: 'long',
              route: 'quiz-long-mcq',
              quizType: 'example'
            }
      case 4:  return {
              quizLength: 'short',
              route: 'quiz-short-mcq',
              quizType: 'synonym'
            }
      case 5: return {
              quizLength: 'short',
              route: 'quiz-short-mcq',
              quizType: 'antonym'
            }
      default: return {
              quizLength: 'short',
              route: 'quiz-short-mcq',
              quizType: 'meaning'
            }
    }
}

