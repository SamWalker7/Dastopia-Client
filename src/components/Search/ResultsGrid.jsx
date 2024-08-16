import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
  Pagination,
} from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import { getDownloadUrl, paginatedSearch } from "../../api";

const ResultsGrid = ({ pickUpTime, DropOffTime, lastEvaluatedKey }) => {
  const [imageUrls, setImageUrls] = useState([]);
  const [loadingStates, setLoadingStates] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastVehicle = currentPage * itemsPerPage;
  const indexOfFirstVehicle = indexOfLastVehicle - itemsPerPage;
  const [currentVehicles, setCurrentVehicles] = useState([]);
  const [lastEvaluated, setLastEvaluated] = useState(lastEvaluatedKey || null);

  const fetchPagination = async () => {
    const response = await paginatedSearch(itemsPerPage, lastEvaluated);
    if (response.statusCode === 200) {
      setLastEvaluated(response.body.lastEvaluatedKey);

      const data = response.body.items.map((item) => {
        return {
          ...item,
          images: [],
          imageLoading: true,
        };
      });
      setCurrentVehicles(data);

      let fetched = [];

      for (let d of data) {
        let urls = [];
        for (let image of d.vehicleImageKeys) {
          const path = await getDownloadUrl(image.key);
          urls.push(path.body || "https://via.placeholder.com/300");
        }
        fetched.push({
          ...d,
          images: urls,
          imageLoading: false,
        });
      }
      setCurrentVehicles(fetched);
     
    }
  };

  useEffect(() => {
    fetchPagination();
  }, [currentPage]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    if (value > currentPage) {
      fetchPagination();
    }
  };

  useEffect(() => {
    const urls = currentVehicles.map((vehicle) => {
      if (Array.isArray(vehicle.images) && vehicle.images.length > 0) {
        return vehicle.images[0];
      } else {
        return null;
      }
    });
    // setImageUrls(urls);
    setLoadingStates({});
  }, [currentVehicles]);

  const handleImageLoad = (index) => {
    setLoadingStates((prev) => ({ ...prev, [index]: false }));
  };

  const handleImageError = (index) => {
    setLoadingStates((prev) => ({ ...prev, [index]: false }));
  };

  return (
    <>
      <Grid
        container
        spacing={3}
        sx={{
          overflowY: "scroll",
          maxHeight: "410px",
          marginTop: "2px",
          width: "95%",
          scrollbarWidth: "none", // For Firefox
          "&::-webkit-scrollbar": {
            display: "none", // For Chrome, Safari, and Opera
          },
        }}
      >
        {currentVehicles.map((vehicle, index) => (
          <Grid
            item
            xs={12}
            key={vehicle.id}
            sx={{
              marginLeft: { xs: "20px", md: "10px" },
              marginRight: { xs: "0px", md: "20px" },
            }}
          >
            <Card
              sx={{
                display: "flex",
                flexDirection: { xs: "row", md: "row" },
                height: "100%",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                border: "1px solid gray",
              }}
            >
              <Grid container>
                <Grid item xs={12} md={4}>
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    {loadingStates[indexOfFirstVehicle + index] !== false ? (
                      <Skeleton
                        variant="rectangular"
                        width="100%"
                        height={200}
                        style={{ marginBottom: "1px" }}
                        animation="wave"
                        sx={{
                          borderRadius: "8px",
                        }}
                      />
                    ) : null}
                    <CardMedia
                      component="img"
                      image={vehicle.images[0]}
                      alt={`Vehicle Image ${index}`}
                      style={{
                        maxHeight: "100%",
                        objectFit: "cover",
                        opacity:
                          vehicle.imageLoading
                            ? 0
                            : 1,
                        transition: "opacity 0.5s ease-in-out",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        borderTopLeftRadius: "8px",
                        borderBottomLeftRadius: "8px",
                      }}
                      onLoad={() =>
                        handleImageLoad(indexOfFirstVehicle + index)
                      }
                      onError={() =>
                        handleImageError(indexOfFirstVehicle + index)
                      }
                    />
                  </div>
                </Grid>
                <Grid item xs={6} md={4}>
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      height: "100%", // Ensures content stretches to full height
                    }}
                  >
                    <div>
                      <Typography
                        gutterBottom
                        variant="h6"
                        component="div"
                        sx={{
                          color: "#354148",
                          fontWeight: 600,
                          marginBottom: "8px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: "2px",
                            alignItems: "center",
                          }}
                        >
                          <strong style={{ fontSize: "15px" }}>Make: </strong>
                          <p style={{ fontSize: "15px" }}>
                            {vehicle.make ? vehicle.make : "Unknown"}
                          </p>
                        </div>
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ marginBottom: "8px" }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: "2px",
                            alignItems: "center",
                          }}
                        >
                          <strong style={{ fontSize: "13px" }}>
                            Transmission:
                          </strong>{" "}
                          <p style={{ fontSize: "13px" }}>
                            {vehicle.transmission
                              ? vehicle.transmission
                              : "Unknown"}
                          </p>
                        </div>
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ marginBottom: "8px" }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: "2px",
                            alignItems: "center",
                          }}
                        >
                          <strong style={{ fontSize: "13px" }}>Color:</strong>{" "}
                          <p style={{ fontSize: "13px" }}>
                            {vehicle.color ? vehicle.color : "Unknown"}
                          </p>
                        </div>
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ marginBottom: "8px" }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: "2px",
                            alignItems: "center",
                          }}
                        >
                          <strong style={{ fontSize: "13px" }}>Seats:</strong>{" "}
                          <p style={{ fontSize: "13px" }}>
                            {vehicle.seats ? vehicle.seats : "Unknown"}
                          </p>
                        </div>
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ marginBottom: "8px" }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: "2px",
                            alignItems: "center",
                          }}
                        >
                          <strong style={{ fontSize: "13px" }}>Doors:</strong>{" "}
                          <p style={{ fontSize: "13px" }}>
                            {vehicle.doors ? vehicle.doors : "Unknown"}
                          </p>
                        </div>
                      </Typography>
                    </div>
                  </CardContent>
                </Grid>
                <Grid item xs={6} md={4}>
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      height: "100%",
                    }}
                  >
                    <div>
                      <Typography
                        gutterBottom
                        variant="h6"
                        component="div"
                        sx={{
                          color: "#354148",
                          fontWeight: 600,
                          marginBottom: "8px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: "2px",
                            alignItems: "center",
                          }}
                        >
                          <strong style={{ fontSize: "15px" }}>Model: </strong>
                          <p style={{ fontSize: "15px" }}>
                            {vehicle.model ? vehicle.model : "Unknown"}
                          </p>
                        </div>
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        gutterBottom
                        sx={{ marginBottom: "8px" }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: "2px",
                            alignItems: "center",
                          }}
                        >
                          <strong style={{ fontSize: "13px" }}>
                            Category:{" "}
                          </strong>
                          <p style={{ fontSize: "13px" }}>
                            {" "}
                            {vehicle.category ? vehicle.category : "Unknown"}
                          </p>
                        </div>
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ marginBottom: "8px" }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: "2px",
                            alignItems: "center",
                          }}
                        >
                          <strong style={{ fontSize: "13px" }}>City:</strong>{" "}
                          <p style={{ fontSize: "13px" }}>
                            {vehicle.city ? vehicle.city : "Unknown"}
                          </p>
                        </div>
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ marginBottom: "8px" }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: "2px",
                            alignItems: "center",
                          }}
                        >
                          <strong style={{ fontSize: "13px" }}>
                            Fuel Type:
                          </strong>{" "}
                          <p style={{ fontSize: "13px" }}>
                            {vehicle.fuelType ? vehicle.typeType : "Unknown"}
                          </p>
                        </div>
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ marginBottom: "8px" }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: "2px",
                            alignItems: "center",
                          }}
                        >
                          <strong style={{ fontSize: "13px" }}>Year</strong>{" "}
                          <p style={{ fontSize: "13px" }}>
                            {vehicle.year ? vehicle.year : "Unknown"}
                          </p>
                        </div>
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ alignSelf: "flex-end" }}
                        onClick={() => {
                          window.location.href = `/Details/${vehicle.id}?pickUpTime=${pickUpTime}&dropOffTime=${DropOffTime}`;
                          localStorage.setItem("pickUpTime", pickUpTime);
                          localStorage.setItem("dropOffTime", DropOffTime);
                        }}
                      >
                        <p style={{ fontSize: "13px" }}> View Details</p>
                      </Button>
                    </div>
                  </CardContent>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Pagination
        count={100 / itemsPerPage}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        sx={{ marginTop: "16px", justifyContent: "center", display: "flex" }}
      />
    </>
  );
};

export default ResultsGrid;
