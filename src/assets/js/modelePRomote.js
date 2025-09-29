// in userList page  

      {/* Add-user-modal-end  */}

      {/* promate-modal-start  */}
      <div
        className="modal fade new-madl"
        id="promate"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header border-0">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <div className="new-madl-profile">
                <div className="text-center">
                  <img src="assets/images/avtar.jpg" alt="" />
                  <h4>Promote Ravi Sharma to admin</h4>
                </div>
                <form action="">
                  <div className="row mb-3">
                    <label htmlFor="" className="col-sm-4 col-form-label">
                      Email ID
                    </label>
                    <div className="col-sm-8">
                      <input type="email" className="form-control" id="" />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-sm-12">
                      <h5>Permissions</h5>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <label htmlFor="" className="col-sm-4 col-form-label">
                      Assigned groups
                    </label>
                    <div className="col-sm-8">
                      <select className="form-select">
                        <option defaultValue="">All Groups</option>
                        <option defaultValue="">Group 1</option>
                        <option defaultValue="">Group 2</option>
                      </select>
                    </div>
                  </div>
                  <div className="row mb-4">
                    <label htmlFor="" className="col-sm-4 col-form-label">
                      Assigned features
                    </label>
                    <div className="col-sm-8">
                      <select className="form-select">
                        <option defaultValue="">All Features</option>
                        <option defaultValue="">Features 1</option>
                        <option defaultValue="">Features 2</option>
                      </select>
                    </div>
                  </div>
                  <div className="text-center mb-3">
                    <button className="thm-btn w-100" type="button">
                      Promote
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* promate-modal-end  */}
      {/* <Pagination/> */}