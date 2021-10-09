let keyword = [];
let tag = [];
let related = [];
let kword = document.getElementById("keyword");
let tg = document.getElementById("tag");
let rel = document.getElementById("related");

function remove(indx, arr){
    if(arr=='t'){
        tag.splice(indx, 1);
        document.getElementById("tags").innerHTML = "";
        tag.map((val, indx)=>{
            document.getElementById("tags").innerHTML += "<span class='tip'>"+val+"<i class='fa fa-times' aria-hidden='true' onclick=\"remove("+indx+", 't')\"></i></span> "
        }) ;
    } else if(arr == 'r'){
        related.splice(indx, 1);
        document.getElementById("relID").innerHTML = "";
        related.map((val, indx)=>{
            document.getElementById("relID").innerHTML += "<span class='tip'>"+val+"<i class='fa fa-times' aria-hidden='true' onclick=\"remove("+indx+", 'r')\"></i></span> "
        }) ;
    } else if(arr == 'k'){
        keyword.splice(indx, 1);
        document.getElementById("keywords").innerHTML = "";
        keyword.map((val, indx)=>{
            document.getElementById("keywords").innerHTML += "<span class='tip'>"+val+"<i class='fa fa-times' aria-hidden='true' onclick=\"remove("+indx+", 'k')\"></i></span> "
        }) ;
    }
}

kword.addEventListener("keydown", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        if(kword.value.trim() != ""){
            keyword.push(kword.value.trim());
            document.getElementById("keywords").innerHTML = "";
            keyword.map((val, indx)=>{
                document.getElementById("keywords").innerHTML += "<span class='tip'>"+val+"<i class='fa fa-times' aria-hidden='true' onclick=\"remove("+indx+", 'k')\"></i></span> ";
            });
        }
        kword.value = "";
    }
  });
tg.addEventListener("keydown", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        if(tg.value.trim() != ""){
            tag.push(tg.value.trim());
            document.getElementById("tags").innerHTML = "";
            tag.map((val, indx)=>{
                document.getElementById("tags").innerHTML += "<span class='tip'>"+val+"<i class='fa fa-times' aria-hidden='true' onclick=\"remove("+indx+", 't')\"></i></span> ";
            });
        }
        tg.value = "";
    }
  });

rel.addEventListener("keydown", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        if(rel.value.trim() != ""){
            related.push(rel.value.trim());
            document.getElementById("relID").innerHTML = "";
            related.map((val, indx)=>{
                document.getElementById("relID").innerHTML += "<span class='tip'>"+val+"<i class='fa fa-times' aria-hidden='true' onclick=\"remove("+indx+", 'r')\"></i></span> ";
            });
        }
        rel.value = "";
    }
  });

function data(){
    const postData = {
        "author" : document.getElementById("author").value,
        "id" : document.getElementById("id").value,
        "title" : document.getElementById("title").value,
        "intro" : document.getElementById("intro").value,
        "description" : document.getElementById("description").value,
        "keyword" : keyword,
        "tags" : tag,
        "related" : related,
        "content" : document.getElementById("content").value
    }

    let ids = [];
    db.collection("posts").get().then((data)=>{
        data.forEach(element => {
            ids.push(element.data().id);
        });

        for(let i = 0; i < postData.related.length; i++){
            if(!(ids.indexOf(postData.related[i]) > -1)){
                alert("Couldn't find id: " + postData.related[i]);
                return;
            }
        }

        db.doc("posts/"+postData.id).set({
            author: postData.author,
            id: postData.id,
            title: postData.title,
            intro: postData.intro,
            desc: postData.description,
            keyword: postData.keyword,
            tags: postData.tags,
            time: new Date(),
            like: 0,
            dislike: 0,
            view: 0
        }).then(()=>{
            db.doc("posts/"+postData.id+"/data/"+postData.id).set({
                content: postData.content,
                related: postData.related
            }).then(()=>{
                alert("Successful...");
                document.getElementById("author").value = "",
                document.getElementById("id").value = "",
                document.getElementById("title").value = "",
                document.getElementById("intro").value = "",
                document.getElementById("description").value = "",
                keyword = [],
                document.getElementById("keywords").innerHTML = "",
                tag = [],
                document.getElementById("tags").innerHTML = "",
                related = [],
                document.getElementById("relID").innerHTML = "",
                document.getElementById("content").value = ""
            }).catch(err=>{
                alert("Something Went Wrong!!")
            })
        }).catch((err)=>{
            alert("Something Went Wrong!");
            console.log(err);
        })


    }).catch(err=>{
        alert("Couldn't load ids.");
        console.log(err);
    });

    

    // console.log(postData);
}


function login(){
    auth.signInWithEmailAndPassword(document.getElementById("email").value, document.getElementById("password").value).then((user)=>{
        // console.log(user);
        console.log("Logged In...");
    }).catch(err=>{
        alert("Invalid Email/Password!");
    });
}

auth.onAuthStateChanged((user) => {
    if (user) {
      document.getElementById('loginForm').style.display = "none";
      document.getElementById('postForm').style.display = "block";
    } else {
        document.getElementById('loginForm').style.display = "block";
        document.getElementById('postForm').style.display = "none";
    }
  });

  document.getElementById("logout").addEventListener("click", ()=>{
      auth.signOut().then(()=>{
        console.log("Logged Out...")
      }).catch(err=>{
          console.log(err);
      })
  })