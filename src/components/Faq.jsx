import { useState } from "react";
import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import shadows from "@mui/material/styles/shadows";

function Faq() {
  const [activeQ, setActiveQ] = useState(null);

  const openQ = (id) => {
    setActiveQ(activeQ === id ? null : id);
  };

  const FaqData = [
    {
      id: "q1",
      question: "1. How do I book a car?",
      answer:
        "You can book a car by downloading our app and following the booking process or by calling our call center where an agent will assist you.",
    },
    {
      id: "q2",
      question: "2. What documents do I need to provide to rent a car?",
      answer:
        "Typically, you will need to provide a valid driver’s license, a government-issued ID or passport, and a credit card for payment and security advance deposit.",
    },
    {
      id: "q3",
      question: "3. What types of cars are available for rent?",
      answer:
        "We offer a wide range of cars from budget options to luxury vehicles. You can view all available options on our app or inquire through our call center.",
    },
    {
      id: "q4",
      question: "4. What is the minimum rental period?",
      answer:
        "The minimum rental period is typically 1 day. However, for specific requirements, you can contact our call center.",
    },
    {
      id: "q5",
      question: "5. How much does it cost to rent a car?",
      answer:
        "The cost varies depending on the type of car, rental period, and any additional services. You can get a detailed price in our app or by contacting our call center.",
    },
    {
      id: "q6",
      question: "6. Is there a mileage limit for rented cars?",
      answer:
        "Depending on the location there is a mileage limit, while others offer unlimited mileage. Details are provided during the booking process.",
    },
    {
      id: "q7",
      question: "7. What is your cancellation policy?",
      answer:
        "Our cancellation policy allows you to cancel your booking up to 24 hours before the rental period starts without any charges. Cancellations made less than 24 hours before the start time may incur a fee.",
    },
    {
      id: "q8",
      question: "8. Can I extend my rental period?",
      answer:
        "Yes, you can extend your rental period subject to availability. Please contact our call center or use the app to request an extension.",
    },
    {
      id: "q9",
      question: "9. What should I do in case of an accident or breakdown?",
      answer:
        "In case of an accident or breakdown, contact our customer support number provided in the rental agreement. We will assist you with roadside assistance or arrange a replacement vehicle.",
    },
    {
      id: "q10",
      question: "10. Are there any additional fees or charges?",
      answer:
        "Additional fees may apply for services such as child seats, additional drivers, or insurance coverage. Details are provided during the booking process.",
    },
    {
      id: "q11",
      question: "11. Can I rent a car without a driver?",
      answer:
        "Yes, you can choose to rent a car without a driver. We also offer cars with drivers for those who prefer it. But for without driver rent, we require an additional deposit.",
    },
    {
      id: "q12",
      question: "12. What payment methods do you accept?",
      answer:
        "We accept major credit cards, debit cards, and mobile payment options. Cash payments are not accepted. Payments should be done in advance.",
    },
    {
      id: "q13",
      question: "13. Is insurance included in the rental price?",
      answer:
        "Basic insurance is included in the rental price. You have the option to purchase additional coverage for extra protection.",
    },
    {
      id: "q14",
      question: "14. How do I return the car?",
      answer:
        "You can return the car to the designated return location specified in your rental agreement. For convenience, you can also arrange for a pick-up through our app or call center.",
    },
    {
      id: "q15",
      question: "15. Can I rent a car for someone else?",
      answer:
        "Yes, you can rent a car for someone else, but the person driving the car must meet our rental requirements and provide the necessary documents.",
    },
    {
      id: "q16",
      question: "16. What happens if I return the car late?",
      answer:
        "Late returns may incur additional charges. Please inform us in advance if you anticipate returning the car late to avoid extra fees.",
    },
    {
      id: "q17",
      question: "17. Can I choose a specific car model?",
      answer:
        "While we strive to provide the car model you prefer, specific models are subject to availability. You can specify your preference during booking, and we will do our best to accommodate it.",
    },
    {
      id: "q18",
      question: "18. Do you offer discounts or loyalty programs?",
      answer:
        "Yes, we offer various loyalty programs for our regular customers. Check our app or inquire through our call center for current promotions and loyalty benefits.",
    },
  ];

  const styles = {
    faqSection: {
      padding: "64px 0",
      backgroundColor: "#f5f5f5",
    },
    faqContent: {
      marginBottom: "24px",
    },
    faqTitle: {
      textAlign: "center",
      marginBottom: "16px",
    },
    faqSubtitle: {
      color: "#9e9e9e",
    },
    faqBox: {
      marginBottom: "24px",
    },
    faqQuestion: {
      cursor: "pointer",
      padding: "5px",
      paddingLeft: "10px",
      border: "1px solid #ddd",
      backgroundColor: "#fff",
      color: "black",
    },
  };

  return (
    <section style={styles.faqSection}>
      <Container maxWidth="md">
        <Box style={styles.faqContent}>
          <Box style={styles.faqTitle}>
            <Typography variant="h2" fontWeight="bold">
              Frequently Asked Questions
            </Typography>
            <Typography variant="h5" color="textSecondary" mb={5} mt={3}>
              All You Need to Know About Booking a Rental Car on Our Platform:
              Expert Answers to Your Most Pressing Questions.
            </Typography>
          </Box>

          <Box>
            {FaqData.map(({ id, question, answer }) => (
              <Paper key={id} style={styles.faqBox}>
                <Accordion expanded={activeQ === id} onChange={() => openQ(id)}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    style={styles.faqQuestion}
                  >
                    <Typography
                      variant="h5"
                      style={{
                        color: "black",
                        fontWeight: "bold",
                        fontSize: "2rem",
                      }}
                    >
                      {question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography
                      variant="h5"
                      style={{
                        fontSize: "1.7rem",
                      }}
                    >
                      {answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </Paper>
            ))}
          </Box>
        </Box>
      </Container>
    </section>
  );
}

export default Faq;
