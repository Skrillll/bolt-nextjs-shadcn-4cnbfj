import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import OpenAI from 'openai';

admin.initializeApp();

const openai = new OpenAI({
  apiKey: functions.config().openai.api_key,
});

export const generateTaskSuggestions = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated to use this feature.');
  }

  const { userId } = data;

  try {
    const userTasks = await admin.firestore().collection('todos')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(10)
      .get();

    const taskTitles = userTasks.docs.map(doc => doc.data().title);

    const prompt = `Based on the following recent tasks, suggest 3 new tasks that the user might want to add:

${taskTitles.join('\n')}

Suggestions:`;

    const response = await openai.completions.create({
      model: 'text-davinci-002',
      prompt,
      max_tokens: 100,
      n: 1,
      stop: null,
      temperature: 0.8,
    });

    const suggestions = response.choices[0].text.trim().split('\n');

    return { suggestions };
  } catch (error) {
    console.error('Error generating task suggestions:', error);
    throw new functions.https.HttpsError('internal', 'Failed to generate task suggestions');
  }
});