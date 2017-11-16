var React = require('react');
var PropTypes = require('prop-types');
import { Table } from 'semantic-ui-react';

function TableComponent (props) {
    var properties = props.properties;
    var headers = Object.keys(properties);
    var repos = props.repos;
    var context = props.context;
    var compact = props.compact;

    return (
      <Table 
        compact={compact} 
        basic='very' 
      >
        <Table.Header>
          <Table.Row> {
                headers.map(function(header, index){
                    return (
                      <Table.HeaderCell key={index}>
                        {
                            (() => 
                            {
                                if (properties[header]["header_renderer"] !== undefined) {
                                    return properties[header]["header_renderer"](header);
                                }
                                else {
                                    return properties[header]["label"];
                                }
                            })()
                        }
                      </Table.HeaderCell>
                    );
                })
            }
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {
                repos.map(function(repo, index) {
                    return (
                      <Table.Row key={index}>
                        {
                                headers.map(function(header, index){
                                    return (
                                      <Table.Cell key={index}>
                                        {(() => {
                                            if (properties[header]["render_callback"] !== undefined) {
                                                return properties[header]["render_callback"](repo, header, context);
                                            }
                                            else if (properties[header]["dataKey"]) {   
                                                return getColumnData(repo, properties[header]["dataKey"]);
                                            }
                                            else {
                                                return repo[header] !== undefined ? repo[header] : "";
                                            }
                                        })()
                                        }
                                      </Table.Cell>
                                    );
                                })
                            }
                      </Table.Row>
                    );
                })
            }
        </Table.Body>
      </Table>
    );
};

function getColumnData(repo, dataKey) {
    let cols = dataKey.split(".");
    if (cols.length <= 0) 
        return "";
    
    let data = repo[cols[0]];
    for (var i = 1; i < cols.length; i++) {
        data = data[cols[i]];
    }

    return data;
}

TableComponent.propTypes = {
    properties: PropTypes.object.isRequired,
    repos: PropTypes.array.isRequired,
    context: PropTypes.object,
    compact: PropTypes.string
};

module.exports = TableComponent;
