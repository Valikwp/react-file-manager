import Loader from "../components/Loader/Loader";
import Toolbar from "./Toolbar/Toolbar";
import NavigationPane from "./NavigationPane/NavigationPane";
import BreadCrumb from "./BreadCrumb/BreadCrumb";
import FileList from "./FileList/FileList";
import Actions from "./Actions/Actions";
import { FilesProvider } from "../contexts/FilesContext";
import { FileNavigationProvider } from "../contexts/FileNavigationContext";
import { SelectionProvider } from "../contexts/SelectionContext";
import { ClipBoardProvider } from "../contexts/ClipboardContext";
import { LayoutProvider } from "../contexts/LayoutContext";
import { useTriggerAction } from "../hooks/useTriggerAction";
import { useColumnResize } from "../hooks/useColumnResize";
import PropTypes from "prop-types";
import { dateStringValidator, urlValidator } from "../validators/propValidators";
import "./FileManager.scss";

const testFiles = [
  {
    name: "Documents",
    isDirectory: true, // Folder
    path: "/Documents", // Located in Root directory
    updatedAt: "2024-09-09T10:30:00Z", // Last updated time
  },
  {
    name: "Pictures",
    isDirectory: true,
    path: "/Pictures", // Located in Root directory as well
    updatedAt: "2024-09-09T11:00:00Z",
  },
  {
    name: "Pic.png",
    isDirectory: false, // File
    path: "/Pictures/Pic.png", // Located inside the "Pictures" folder
    updatedAt: "2024-09-08T16:45:00Z",
    size: 2048, // File size in bytes (example: 2 KB)
    type: "png",
  },
];

const FileManager = ({
                       fileUploadConfig = {
                         url: "/upload",
                         headers: {},
                         method: "POST",
                       },
                       isLoading = false,
                       onCreateFolder = () => {},
                       onFileUploading = () => {},
                       onFileUploaded = () => {},
                       onCut = () => {},
                       onCopy = () => {},
                       onPaste = () => {},
                       onRename = () => {},
                       onDownload = () => {},
                       onDelete = () => {},
                       onLayoutChange = () => {},
                       onRefresh = () => {},
                       onFileOpen = () => {},
                       onSelect = () => {},
                       onError = () => {},
                       layout = "grid",
                       enableFilePreview = true,
                       maxFileSize = 1000000,
                       filePreviewPath = "",
                       acceptedFileTypes = "",
                       height = "600px",
                       width = "100%",
                       initialPath = "",
                       filePreviewComponent = null,
                       primaryColor = "#6155b4",
                       fontFamily = "Nunito Sans, sans-serif",
                     }) => {
  const triggerAction = useTriggerAction();
  const { containerRef, colSizes, isDragging, handleMouseMove, handleMouseUp, handleMouseDown } =
      useColumnResize(20, 80);

  const customStyles = {
    "--file-manager-font-family": fontFamily,
    "--file-manager-primary-color": primaryColor,
    height,
    width,
  };

  return (
      <main className="file-explorer" onContextMenu={(e) => e.preventDefault()} style={customStyles}>
        <Loader loading={isLoading} />
        <FilesProvider filesData={testFiles} onError={onError}>
          <FileNavigationProvider initialPath={initialPath}>
            <SelectionProvider onDownload={onDownload} onSelect={onSelect}>
              <ClipBoardProvider onPaste={onPaste} onCut={onCut} onCopy={onCopy}>
                <LayoutProvider layout={layout}>
                  <Toolbar
                      allowCreateFolder
                      allowUploadFile
                      onLayoutChange={onLayoutChange}
                      onRefresh={onRefresh}
                      triggerAction={triggerAction}
                  />
                  <section
                      ref={containerRef}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      className="files-container"
                  >
                    <div className="navigation-pane" style={{ width: colSizes.col1 + "%" }}>
                      <NavigationPane onFileOpen={onFileOpen} />
                      <div
                          className={`sidebar-resize ${isDragging ? "sidebar-dragging" : ""}`}
                          onMouseDown={handleMouseDown}
                      />
                    </div>

                    <div className="folders-preview" style={{ width: colSizes.col2 + "%" }}>
                      <BreadCrumb />
                      <FileList
                          onCreateFolder={onCreateFolder}
                          onRename={onRename}
                          onFileOpen={onFileOpen}
                          onRefresh={onRefresh}
                          enableFilePreview={enableFilePreview}
                          triggerAction={triggerAction}
                      />
                    </div>
                  </section>

                  <Actions
                      fileUploadConfig={fileUploadConfig}
                      onFileUploading={onFileUploading}
                      onFileUploaded={onFileUploaded}
                      onDelete={onDelete}
                      onRefresh={onRefresh}
                      maxFileSize={maxFileSize}
                      filePreviewPath={filePreviewPath}
                      filePreviewComponent={filePreviewComponent}
                      acceptedFileTypes={acceptedFileTypes}
                      triggerAction={triggerAction}
                      files={testFiles}
                  />
                </LayoutProvider>
              </ClipBoardProvider>
            </SelectionProvider>
          </FileNavigationProvider>
        </FilesProvider>
      </main>
  );
};

FileManager.displayName = "FileManager";

FileManager.propTypes = {
  fileUploadConfig: PropTypes.shape({
    url: urlValidator,
    headers: PropTypes.objectOf(PropTypes.string),
    method: PropTypes.oneOf(["POST", "PUT"]),
  }),
  isLoading: PropTypes.bool,
  onCreateFolder: PropTypes.func,
  onFileUploading: PropTypes.func,
  onFileUploaded: PropTypes.func,
  onRename: PropTypes.func,
  onDelete: PropTypes.func,
  onCut: PropTypes.func,
  onCopy: PropTypes.func,
  onPaste: PropTypes.func,
  onDownload: PropTypes.func,
  onLayoutChange: PropTypes.func,
  onRefresh: PropTypes.func,
  onFileOpen: PropTypes.func,
  onSelect: PropTypes.func,
  onError: PropTypes.func,
  layout: PropTypes.oneOf(["grid", "list"]),
  maxFileSize: PropTypes.number,
  enableFilePreview: PropTypes.bool,
  filePreviewPath: urlValidator,
  acceptedFileTypes: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  initialPath: PropTypes.string,
  filePreviewComponent: PropTypes.func,
  primaryColor: PropTypes.string,
  fontFamily: PropTypes.string,
};

export default FileManager;
