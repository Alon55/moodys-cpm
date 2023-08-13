import React, {
  useState,
  useEffect,
  ReactElement,
  ChangeEvent,
  MouseEvent,
} from "react";
import { debounce } from "lodash";
import {
  Paper,
  Avatar,
  IconButton,
  TextField,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  styled,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import noData from "./noData.svg";

interface Photo {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

export default function PhotosTable(): ReactElement {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const [searchText, setSearchText] = useState<string>("");
  const rowsPerPage: number = 50;

  useEffect(() => {
    // fetch 50 photos or photos 'like' search value + loader + handle error
    try {
      setLoading(true);
      fetch(
        `https://jsonplaceholder.typicode.com/photos?${
          searchText ? "title_like=^" + searchText : "albumId=" + (page + 1)
        }`
      )
        .then((response) => response.json())
        .then((json) => {
          setPhotos(json);
          setLoading(false);
        });
    } catch (error) {
      setPhotos([]);
      setLoading(false);
    }
  }, [page, searchText]);

  const handleChangePage = (e: MouseEvent | null, newPage: number) => {
    // change page + API request for 50 photos
    setPage(newPage);
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    // change search value + API request for 'like' title
    setSearchText(e.target.value);
  };

  const debounced = debounce((e) => {
    // deboune search to reduce API requests
    handleSearch(e);
  }, 500);

  const removeTitle = (id: number) => {
    // delete photo from array
    setPhotos((prev) => prev.filter((photo: Photo) => photo.id !== id));
  };

  return (
    <Container>
      <PaperHeader>
        <DivHeader>
          <Header>🚀 The Photos Table</Header>
          <TextField
            id="standard-basic"
            label="Search..."
            variant="standard"
            InputProps={{ disableUnderline: true }}
            size="small"
            onChange={debounced}
          />
        </DivHeader>
      </PaperHeader>
      <PaperTable>
        {loading ? (
          <CircularProgressStyled /> // loader
        ) : !photos.length ? (
          <DivNoData>
            <img src={noData} alt="No Data To Display" />
            <p>No Data To Display</p>
          </DivNoData>
        ) : (
          <DivTable>
            <DivTableHeader>
              <h4>Photo</h4>
              <h4>Title</h4>
              <h4>Remove</h4>
            </DivTableHeader>
            <TableContainerStyled>
              <Table stickyHeader aria-label="sticky table">
                <TableBody>
                  {photos
                    .slice(
                      searchText ? page * rowsPerPage : 0,
                      page * rowsPerPage + rowsPerPage
                    )
                    .map((photo: Photo) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={photo.id}
                        >
                          <TableCell>
                            <Avatar src={photo.thumbnailUrl} />
                          </TableCell>
                          <TableCell>{photo.title}</TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => removeTitle(photo.id)}
                              aria-label="delete"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainerStyled>
            <TablePagination
              rowsPerPageOptions={[]}
              component="div"
              count={searchText ? photos.length : 5000}
              rowsPerPage={50}
              page={page}
              onPageChange={handleChangePage}
            />
          </DivTable>
        )}
      </PaperTable>
    </Container>
  );
}

const Container = styled("div")({ height: "90%", width: "80%" });

const PaperHeader = styled(Paper)({
  overflow: "hidden",
  borderRadius: "5px",
  boxShadow: "0px 0px 10px 1px #888888",
  margin: "30px auto 20px",
});

const PaperTable = styled(Paper)({
  height: "75%",
  overflow: "hidden",
  borderRadius: "5px",
  boxShadow: "0px 0px 10px 1px #888888",
  margin: "auto",
  textAlign: "center",
  display: "flex",
});

const DivHeader = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: "lightgray",
  height: "70px",
  padding: "0px 30px",
});

const Header = styled("h2")({ margin: 0 });

const DivNoData = styled("div")({
  textAlign: "center",
  margin: "auto",
  fontWeight: "bold",
});

const CircularProgressStyled = styled(CircularProgress)({ margin: "auto" });

const DivTable = styled("div")({ width: "100%" });

const TableContainerStyled = styled(TableContainer)({
  height: "75%",
  width: "100%",
});

const DivTableHeader = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: " 0px 20px",
  backgroundColor: "lightgray",
});
