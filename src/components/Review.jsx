import React, { useState } from 'react';

const ReviewForm = ({ carId, userId, userName }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const handleStarClick = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleReviewChange = (event) => {
    setReviewText(event.target.value);
  };

  const handleSubmit = async () => {
    if (!rating) {
      alert('Please give a rating before submitting.');
      return;
    }

    setIsSubmitting(true);
    setSubmissionError('');
    setSubmissionSuccess(false);

    try {
      const response = await fetch(
        'https://xo55y7ogyj.execute-api.us-east-1.amazonaws.com/prod/add_vehicle',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            operation: 'addRatingandReview',
            userId: "a41854a8-a011-7032-e01b-8fea894234ac",
            carId: "a011fb46-297e-472d-a3c0-bce3e95ddd39",
            rating: rating,
            review: reviewText,
            userName:"a41854a8-a011-7032-e01b-8fea894234ac",
          }),
        }
      );

      if (response.ok) {
        setSubmissionSuccess(true);
        setRating(0);
        setReviewText('');
      } else {
        const errorData = await response.json();
        setSubmissionError(errorData?.message || 'Failed to submit review. Please try again later.');
      }
    } catch (error) {
      setSubmissionError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-64px)] py-4 px-4 bg-gray-50"> {/* Adjust 64px to match your navbar height */}
      <div className="w-full max-w-md p-4 border border-gray-300 rounded-md bg-gray-100 shadow">
        <h2 className="text-center font-medium mb-2">How was your experience?</h2>
        <p className="text-center text-sm text-gray-600 mb-3">
          Your rating helps improve our service
        </p>

        <div className="text-center mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star cursor-pointer text-2xl mr-1 ${
                star <= rating ? 'text-yellow-500' : 'text-gray-300'
              }`}
              onClick={() => handleStarClick(star)}
            >
              ★
            </span>
          ))}
        </div>

        <div className="mb-3">
          <textarea
            id="review"
            value={reviewText}
            onChange={handleReviewChange}
            placeholder="Write your review..."
            className="shadow appearance-none border rounded-xl w-full h-32 py-2 px-3 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        {submissionError && <p className="text-red-500 text-xs mb-1">{submissionError}</p>}
        {submissionSuccess && <p className="text-green-500 text-xs mb-1">Review submitted successfully!</p>}

        <button
          onClick={handleSubmit}
          className="bg-blue-950 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-xl focus:outline-none focus:shadow-outline w-full text-sm"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </div>
  );
};

export default ReviewForm;