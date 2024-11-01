/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Home = () => {
  const [poem, setPoem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [remainingTexts, setRemainingTexts] = useState<string[]>([]);

  const buttonTexts = [
    'Send forth a final shanty',
    'Another warrior’s rally',
    'Another blood chant',
    'Regale another stanza to cry out in battle',
    'Another hymn for my axe',
    'Deliver another ragged tune',
    'Summon another fearless lyric',
    'One more mighty verse',
    "Another toast to the saga of old",
    "Another dirge for the defiant"
  ];

  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const fetchPoem = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('NEXT_PUBLIC_OPENAI_API_KEY API Key:', process.env.NEXT_PUBLIC_OPENAI_API_KEY);
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: 'give me a manly poem and include the author and year below it. make them unique but classics' }],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPEN_AI}`,
          },
        }
      );
      setPoem((response.data as any).choices[0].message.content);

    } catch (err) {
      console.log(err);
      setError('Failed to fetch poem.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoem();
    setRemainingTexts(shuffleArray([...buttonTexts]));
  }, []);

  const handleButtonClick = () => {
    fetchPoem();
    if (remainingTexts.length === 1) {
      setRemainingTexts(shuffleArray([...buttonTexts]));
    } else {
      setRemainingTexts(remainingTexts.slice(1));
    }
  };

  return (
    <div className="flex justify-center items-center h-screen flex-col">
      <div className="w-4/5 text-center">
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {poem && <p>{poem}</p>}
      </div>
      <button onClick={handleButtonClick} className="mt-5 border border-black bg-white text-black py-2 px-4 transition duration-300 hover:bg-black hover:text-white">
        {remainingTexts[0]}
      </button>
    </div>
  );
};

export default Home;