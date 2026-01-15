import React from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import MaterialAppBar from "./Menu"; // your navbar
import Footer from "./Footer"; // your footer

const AboutUs = () => {
  return (
    <Box>
      {/* NAVBAR */}
      <MaterialAppBar />

      {/* HERO SECTION */}
      <Box
        sx={{
          position: "relative",
          height: { xs: "300px", md: "420px" },
          backgroundImage:
            "url('https://images.unsplash.com/photo-1511499767150-a48a237f0083')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.45)",
          }}
        />

        {/* Hero Content */}
        <Box sx={{ position: "relative", textAlign: "center", color: "#fff" }}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            About Us
          </Typography>

          <Typography
            variant="body1"
            sx={{ maxWidth: 600, mx: "auto", mb: 3 }}
          >
            Optix is a smart eyewear platform that makes choosing the right
            frames clear, easy, and trustworthy.
          </Typography>

          <Button
            variant="contained"
            sx={{
              backgroundColor: "#F4E04D",
              color: "#000",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "#e6d23f",
              },
            }}
          >
            See More
          </Button>
        </Box>
      </Box>

      {/* CONTENT SECTION */}
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
          Optix is a modern eyewear and optical solutions platform built to make
          choosing the right glasses simple, reliable, and enjoyable. We combine
          clear product information, smart tools, and user-friendly design to
          help customers find eyewear that fits their style, comfort, and daily
          needs.
        </Typography>

        <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
          Our focus is on quality, transparency, and accessibility. Every frame
          and lens we feature is carefully selected for durability, protection,
          and value. From classic designs to contemporary looks, Optix provides
          a curated range suitable for students, professionals, and anyone who
          wants eyewear that feels right.
        </Typography>

        <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
          We aim to remove the confusion from eyewear shopping by offering
          detailed product insights, clear specifications, and helpful guidance
          throughout the journey. With Optix, finding the perfect pair isn’t
          complicated. It’s straightforward, trustworthy, and tailored to your
          needs.
        </Typography>
      </Container>

      {/* FOOTER */}
      <Footer />
    </Box>
  );
};

export default AboutUs;
