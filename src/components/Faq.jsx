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
      question: "1. What makes comparing rental car deals worthwhile?",
      answer:
        "Comparing rental car deals is important as it helps find the best deal that fits your budget and requirements, ensuring you get the most value for your money. By comparing various options, you can find deals that offer lower prices, additional services, or better car models. You can find car rental deals by researching online and comparing prices from different rental companies.",
    },
    {
      id: "q2",
      question: "2. Where can I find the best car rental deals?",
      answer:
        "You can find car rental deals by researching online and comparing prices from different rental companies. Websites such as Expedia, Kayak, and Travelocity allow you to compare prices and view available rental options. It is also recommended to sign up for email newsletters and follow rental car companies on social media to be informed of any special deals or promotions.",
    },
    {
      id: "q3",
      question: "3. How can I secure the lowest rental car prices?",
      answer:
        "Book in advance: Booking your rental car ahead of time can often result in lower prices. Compare prices from multiple companies: Use websites like Kayak, Expedia, or Travelocity to compare prices from multiple rental car companies. Look for discount codes and coupons: Search for discount codes and coupons that you can use to lower the rental price. Renting from an off-airport location can sometimes result in lower prices.",
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
    },
  };

  return (
    <section style={styles.faqSection}>
      <Container maxWidth="md">
        <Box style={styles.faqContent}>
          <Box style={styles.faqTitle}>
            <Typography variant="h3" fontWeight="bold">
              Frequently Asked Questions
            </Typography>
            <Typography variant="h6" color="textSecondary" mb={5} mt={3}>
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
                    <Typography variant="h6">{question}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="h6">{answer}</Typography>
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
