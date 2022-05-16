import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { FormLoader } from '../basic/Loader';
import ShouldRender from '../basic/ShouldRender';
import { unblockProject } from '../../actions/project';
import { openModal, closeModal } from 'CommonUI/actions/Modal';

export class ProjectUnblockBox extends Component<ComponentProps>{
    public static displayName = '';
    public static propTypes = {};

    constructor(props: $TSFixMe) {
        super(props);
    }

    handleClick = () => {

        const { unblockProject, project }: $TSFixMe = this.props;
        return unblockProject(project._id);
    };

    override render() {

        const { isRequesting }: $TSFixMe = this.props;

        return (
            <div className="Box-root Margin-bottom--12">
                <div className="bs-ContentSection Card-root Card-shadow--medium">
                    <div className="Box-root">
                        <div className="bs-ContentSection-content Box-root Box-divider--surface-bottom-1 Flex-flex Flex-alignItems--center Flex-justifyContent--spaceBetween Padding-horizontal--20 Padding-vertical--16">
                            <div className="Box-root">
                                <span className="Text-color--inherit Text-display--inline Text-fontSize--16 Text-fontWeight--medium Text-lineHeight--24 Text-typeface--base Text-wrap--wrap">
                                    <span>Unblock This Project</span>
                                </span>
                                <p>
                                    <span>
                                        Click the button to unblock this
                                        project.
                                    </span>
                                </p>
                            </div>
                            <div className="bs-ContentSection-footer bs-ContentSection-content Box-root Box-background--white Flex-flex Flex-alignItems--center Flex-justifyContent--spaceBetween Padding-horizontal--0 Padding-vertical--12">
                                <span className="db-SettingsForm-footerMessage"></span>
                                <div>
                                    <button
                                        id="unblock"
                                        className="bs-Button bs-Button--blue Box-background--blue"
                                        disabled={isRequesting}
                                        onClick={this.handleClick}
                                    >
                                        <ShouldRender if={!isRequesting}>
                                            <span>Unblock</span>
                                        </ShouldRender>
                                        <ShouldRender if={isRequesting}>
                                            <FormLoader />
                                        </ShouldRender>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


ProjectUnblockBox.displayName = 'ProjectUnblockBox';

const mapDispatchToProps: Function = (dispatch: Dispatch) => bindActionCreators({ unblockProject, openModal, closeModal }, dispatch);

const mapStateToProps: Function = (state: RootState) => {
    const project: $TSFixMe = state.project.project.project;
    return {
        project,
        isRequesting:
            state.project &&
            state.project.unblockProject &&
            state.project.unblockProject.requesting,
    };
};


ProjectUnblockBox.propTypes = {
    isRequesting: PropTypes.oneOf([null, undefined, true, false]),
    project: PropTypes.object.isRequired,
    unblockProject: PropTypes.func.isRequired,
};


ProjectUnblockBox.contextTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectUnblockBox);