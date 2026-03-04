const { createGenerator } = require('./generators');

class QuestionGenerator {
  constructor(roadType = 'regular') {
    this.generator = createGenerator(roadType);
  }

  generateQuestion(topicType = 'signs') {
    return this.generator.generateQuestion(topicType);
  }

  generateQuestions(count = 20, topicType = 'signs') {
    return this.generator.generateQuestions(count, topicType);
  }
}

module.exports = QuestionGenerator;
