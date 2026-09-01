function UploadPolicy({ nav, data, setData }) {
  const [values, setValues] = useState({
    name: '',
    type: 'Clinical',
    effectiveDate: '',
    reviewDate: '',
    description: '',
    fileName: '',
  });

  const change = (key, value) => {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const submit = (e) => {
    e.preventDefault();

    if (!values.name.trim()) {
      window.alert('Please enter a policy name.');
      return;
    }

    const policy = {
      id: `POL-${String(
        (data.policies?.length || 0) + 1
      ).padStart(3, '0')}`,

      name: values.name.trim(),

      type: values.type,

      effectiveDate:
        values.effectiveDate || '21 Aug 2026',

      reviewDate:
        values.reviewDate || '21 Aug 2027',

      uploaded: '21 Aug 2026',

      status: 'Active',

      description:
        values.description.trim() ||
        'Policy document uploaded to the LanbethCare compliance portal.',

      fileName:
        values.fileName ||
        `${values.name.trim()}.pdf`,
    };

    setData({
      ...data,
      policies: [
        ...(data.policies || []),
        policy,
      ],
    });

    nav('/policies');
  };

  return (
    <>
      <Header
        title="Upload Policy"
        sub="Add a new policy document to the compliance library."
      />

      <section className="form-card">
        <form onSubmit={submit}>
          <div className="form-grid">
            <label>
              Policy Name

              <input
                value={values.name}
                onChange={(e) =>
                  change('name', e.target.value)
                }
                placeholder="Enter policy name"
                required
              />
            </label>

            <label>
              Policy Type

              <select
                value={values.type}
                onChange={(e) =>
                  change('type', e.target.value)
                }
              >
                <option>Clinical</option>
                <option>Safeguarding</option>
                <option>Health & Safety</option>
                <option>HR</option>
                <option>Compliance</option>
              </select>
            </label>

            <label>
              Effective Date

              <input
                type="date"
                value={values.effectiveDate}
                onChange={(e) =>
                  change(
                    'effectiveDate',
                    e.target.value
                  )
                }
              />
            </label>

            <label>
              Review Date

              <input
                type="date"
                value={values.reviewDate}
                onChange={(e) =>
                  change(
                    'reviewDate',
                    e.target.value
                  )
                }
              />
            </label>

            <label className="wide">
              Description

              <textarea
                value={values.description}
                onChange={(e) =>
                  change(
                    'description',
                    e.target.value
                  )
                }
                placeholder="Enter a description for this policy..."
                rows={5}
              />
            </label>

            <label className="wide">
              Policy Document

              <div className="file-upload">
                <Upload size={20} />

                <div>
                  <b>Upload policy document</b>

                  <small>
                    PDF, DOC or DOCX files
                  </small>
                </div>

                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    const file =
                      e.target.files?.[0];

                    if (file) {
                      change(
                        'fileName',
                        file.name
                      );
                    }
                  }}
                />
              </div>

              {values.fileName && (
                <span className="selected-file">
                  Selected: {values.fileName}
                </span>
              )}
            </label>
          </div>

          <div className="form-footer">
            <button
              type="button"
              className="outline"
              onClick={() => nav('/policies')}
            >
              Cancel
            </button>

            <button
              className="primary"
              type="submit"
            >
              <Upload size={15} />
              Upload Policy
            </button>
          </div>
        </form>
      </section>

      <BackLink nav={nav} />
    </>
  );
}