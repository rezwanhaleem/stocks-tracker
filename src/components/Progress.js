import React from 'react';

import '../style/Progress.css';

class Progress extends React.Component {
    state = {
        progess: 0,
        bounds: {
            start: undefined,
            end: undefined,
            len: undefined
        },
        Animate: 'anim',
        moving: ''
    };

    handleMouseDown = (e) => {
        let bounds = e.currentTarget.getBoundingClientRect();
        let x = e.clientX;
        this.setState(
            { moving: 'moving', bounds: { start: bounds.left, end: bounds.right, len: (bounds.right - bounds.left) } },
            () => this.setState({ progess: this.getBarPercent(x) })
        );
        document.addEventListener("mouseup", this.handleMouseUp, false);
        document.addEventListener("mousemove", this.handleMouseMove, false);

    }

    handleMouseUp = (e) => {
        this.setState({ moving: '' });
        document.removeEventListener("mouseup", this.handleMouseUp, false);
        document.removeEventListener("mousemove", this.handleMouseMove, false);
        let nearestPoint = Math.round(this.props.points * (this.state.progess / 100));
        this.props.onPlayerSelect(nearestPoint);
    }

    handleMouseMove = (e) => {
        this.setState({ progess: this.getBarPercent(e.clientX) });
    }

    getBarPercent = (currentPos) => {
        if (currentPos < this.state.bounds.start) {
            return 0;
        }
        else if (currentPos > this.state.bounds.end) {
            return 100;
        }

        let x = currentPos - this.state.bounds.start;
        let pos = x / this.state.bounds.len;
        return Math.round(pos * 100);
    }

    componentDidUpdate(prevProps) {
        if (this.props.visible !== prevProps.visible) {
            let percent = Math.round((this.props.visible / this.props.points) * 100);
            this.setState({ progess: percent });
        }

        if (this.props.page !== prevProps.page) {
            const anim = this.props.page === 1? '': 'anim';
            setTimeout(() => { 
                this.setState({ Animate: anim });
            }, 1000);
        }
    }

    render() {
        return (
            <div className="Progress">
                <section>
                    <article>
                        <div className="chart">
                            <div className={"bar bar-" + this.state.progess + " white " + this.state.Animate}>
                                <div className="face top" onMouseDown={this.handleMouseDown}>
                                    <div className={"growing-bar " + this.state.moving}></div>
                                </div>
                                <div className="face side-0">
                                    <div className={"growing-bar " + this.state.moving}></div>
                                </div>
                                <div className="face floor">
                                    <div className={"growing-bar " + this.state.moving}></div>
                                    {this.props.players.map((player, index, arr) => (
                                        <div key={index} className="point" style={{ left: (Math.abs(index / (arr.length - 1) * 100) - (index === 0 ? 0 : 0.5)) + "%" }}></div>
                                    ))}
                                </div>
                                <div className="face side-a"></div>
                                <div className="face side-b"></div>
                                <div className="face side-1" onMouseDown={this.handleMouseDown}>
                                    <div className={"growing-bar " + this.state.moving}></div>
                                </div>
                            </div>
                        </div>
                    </article>
                </section>
            </div>
        );

    }
}

export default Progress;
