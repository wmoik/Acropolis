<!DOCTYPE html>
<html lang="en">
  <head>

      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      <meta name="description" content="">
      <meta name="author" content="">

      <title>Acropolis - Limited Edition Digital Artwork</title>

      <!-- Bootstrap core CSS -->
      <link href="css/bootstrap0.min.css" rel="stylesheet">

      <!-- Custom styles for this template -->
      <link href="css/3-col-portfolio.css" rel="stylesheet">

    </head>

    <body>

      <!-- Navigation -->
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div class="container">
          <a class="navbar-brand" href="#">ACROPOLIS</a>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarResponsive">
            <ul class="navbar-nav ml-auto">
              <li class="nav-item active">
                <a class="nav-link" href="#">Artwork
                  <span class="sr-only">(current)</span>
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">About</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="upload.html">Upload</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">Contact</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>


    <div class="container">
          <h1 class="text-center">Acropolis Blockchain Art</h1>
          <hr/>
          <br/>

          <div class="row">
                     <?php

                     $servername = "127.0.0.1";
                     $username = "root";
                     $password = "CARTPass";
                     $database = "cryptoWarehouse";

                     // Create connection
                     $conn = mysqli_connect($servername, $username, $password, $database);

                     // Check connection
                     if (!$conn) {
                         die("Connection failed: " . mysqli_connect_error());
                     }
                     else{
                        $query= "SELECT title, description, artistalias, pathToImage, noa FROM CARTable ";
                        $results =mysqli_query($conn, $query);

                        if ($results->num_rows > 0) {
                          // output data of each row
                          while($row = $results->fetch_assoc()) {
                              echo '
                              <div class="col-lg-4 col-sm-6 portfolio-item">
                                <div class="panel panel-default panel-art">
                                  <div class="panel-heading">
                                    <h3 class="panel-title">'.$row["title"].'</h3>
                                  </div>
                                  <a href="#"><img class="card-img-top" src="'.$row["pathToImage"].'" alt=""></a>
                                  <div class="card-body">
                                  <br/><br/>
                                  <strong>Artist</strong>: <span class="artist-name">'.$row["artistalias"].'</span><br/>
                                  <strong>Number in Existence</strong>: <span class="art-noa">'.$row["noa"].'</span><br/>
                                  <strong>Date Created</strong>: <span class="art-timestamp">'.$row["timestampUpload"].'</span><br/>
                                  <strong>Description</strong>: <span class="card-text">'.$row["description"].'</span><br/><br/>
                                  <button class="btn btn-default btn-bid" type="button" data-id="0">Bid</button>
                                  </div>
                                </div>
                              </div>';
                          }
                      } else {
                          echo "0 results";
          }
                    }
                    $conn->close();

                     ?>

                     <div class="col-lg-4 col-sm-6 portfolio-item" id=artDetails>
                       <div class="panel panel-default panel-art">
                         <div class="panel-heading">
                           <h3 class="panel-title">TEST</h3>
                         </div>
                         <a href="#"><img class="card-img-top" src="uploads/GrewingkGlacierAlaska-opt.jpg" alt=""></a>
                         <div class="card-body">
                         <br/><br/>
                         <strong>Artist</strong>: <span class="artist-name"><hash-display :hash="state.artData.hashValue"></hash-display></span><br/>
                         <strong>Number in Existence</strong>: <span class="art-noa">'.$row["noa"].'</span><br/>
                         <strong>Date Created</strong>: <span class="art-timestamp">'.$row["timestampUpload"].'</span><br/>
                         <strong>Description</strong>: <span class="card-text">'.$row["description"].'</span><br/><br/>
                         <button class="btn btn-default btn-bid" type="button" data-id="0">Bid</button>
                         </div>
                       </div>
                     </div>

                  </div>




      <p id="CreationEventLog">No Events Logged.</p>


      <div id="artTemplate" style="display: none;">
        <div class="col-sm-6 col-md-4 col-lg-3">
          <div class="panel panel-default panel-art">
            <div class="panel-heading">
              <h3 class="panel-title">Scrappy</h3>
            </div>
            <div class="panel-body">
              <img alt="140x140" data-src="holder.js/140x140" class="img-rounded img-center" style="width: 100%;" src="" data-holder-rendered="true">
              <br/><br/>
              <strong>Artist</strong>: <span class="artist-name"><value-display :amount="state.artData.hashValue"></value-display></span><br/>
              <strong>Number in Existence</strong>: <span class="art-noa">"state.artData.hashValue"</span><br/>
              <strong>Date Created</strong>: <span class="art-timestamp">July 1st</span><br/><br/>
              <button class="btn btn-default btn-bid" type="button" data-id="0">Bid</button>
            </div>
          </div>
        </div>
      </div>


      </div>
<script src="https://vuejs.org/js/vue.js"></script>
<!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<script type="text/javascript"></script>
<script src="js/app.js"></script>
<script>
    // Extra contract actions
    var artData = new Vue({
        el: '#artDetails',
        data: {
            state: Cryptoart.ArtState
        },
        computed: {
            isForSaleToSpecificAddress: function() {
                return this.state.artData.onlySellTo != Cryptoart.NULL_ADDRESS;
            },
            isMainDataLoaded: function() {
                return this.state.loadingDone.owner && this.state.loadingDone.bid && this.state.loadingDone.offer;
            },
            isEventDataLoaded: function() {
                return this.state.loadingDone.eventsClaimed;
            }
        }
    });

    cryptoartContractLoadedCallback = function() {
        Cryptoart.loadArtData(29);
    }

</script>

  <!-- Footer -->
<footer class="py-5 bg-dark">
  <div class="container">
    <p class="m-0 text-center text-white">Copyright &copy; Acropolis 2017</p>
  </div>
  <!-- /.container -->
</footer>


</body>




    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="js/bootstrap.min.js"></script>
    <script src="js/web3.min.js"></script>
    <script src="js/truffle-contract.js"></script>

  </body>
</html>
