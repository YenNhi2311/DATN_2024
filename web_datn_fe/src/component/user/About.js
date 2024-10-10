import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "../../assets/css/about.css"; // Import CSS tùy chỉnh

const About = () => {
  return (
    <Container className="about-page">
      <Row>
        <Col md={4}>
          <Card className="info-card">
            <Card.Header className="card-header">
              <h5>Personal Info</h5>
            </Card.Header>
            <Card.Body>
              <p>
                <i className="fa fa-user"></i> <strong>About Me:</strong>
              </p>
              <p>
                Hi, I’m John Carter, I’m 36 and I work as a Digital Designer for
                the “dewwater” Agency in Ontario, Canada
              </p>
              <p>
                <i className="fa fa-birthday-cake"></i>{" "}
                <strong>Birthday:</strong>
              </p>
              <p>December 17, 1985</p>
              <p>
                <i className="fa fa-phone"></i> <strong>Phone Number:</strong>
              </p>
              <p>+1-989-232435234</p>
              <p>
                <i className="fa fa-tint"></i> <strong>Blood Group:</strong>
              </p>
              <p>B+</p>
              <p>
                <i className="fa fa-venus-mars"></i> <strong>Gender:</strong>
              </p>
              <p>Male</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <Card className="info-card">
            <Card.Header className="card-header">
              <h5>General Info</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <p>
                    <i className="fa fa-heart"></i> <strong>Hobbies:</strong>
                  </p>
                  <p>
                    I like to ride the bicycle, swimming, and working out. I
                    also like reading design magazines, and searching on
                    internet, and also binge watching a good hollywood Movies
                    while it’s raining outside.
                  </p>
                </Col>
                <Col md={6}>
                  <p>
                    <i className="fa fa-graduation-cap"></i>{" "}
                    <strong>Education:</strong>
                  </p>
                  <p>
                    Master of computer science, sixteen years degree From Oxford
                    University, London
                  </p>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <p>
                    <i className="fa fa-star"></i>{" "}
                    <strong>Other Interests:</strong>
                  </p>
                  <p>
                    Swimming, Surfing, Uber Diving, Anime, Photography, Tattoos,
                    Street Art.
                  </p>
                </Col>
                <Col md={6}>
                  <p>
                    <i className="fa fa-briefcase"></i>{" "}
                    <strong>Work and experience:</strong>
                  </p>
                  <p>
                    Currently working in the "color hands" web development
                    agency from the last 5 five years as Senior UI/UX Designer
                  </p>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <p>
                    <i className="fa fa-share-alt"></i>{" "}
                    <strong>Social Networks:</strong>
                  </p>
                  <p>
                    <i className="fa fa-facebook"></i>{" "}
                    <i className="fa fa-twitter"></i>{" "}
                    <i className="fa fa-instagram"></i>{" "}
                    <i className="fa fa-linkedin"></i>{" "}
                    <i className="fa fa-vk"></i>{" "}
                    <i className="fa fa-github"></i>
                  </p>
                </Col>
                <Col md={6}>
                  <p>
                    <i className="fa fa-trophy"></i> <strong>Badges:</strong>
                  </p>
                  <p>
                    <i className="fa fa-medal"></i>{" "}
                    <i className="fa fa-medal"></i>{" "}
                    <i className="fa fa-medal"></i>{" "}
                    <i className="fa fa-medal"></i>{" "}
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default About;
